<?php
/**
 * Plugin Name: AssistantBot
 * Description: Checkout and access-code delivery for AssistantBot.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: B&H Assistant d.o.o.
 * License: GPL-2.0-or-later
 * Text Domain: assistantbot
 */

defined('ABSPATH') || exit;

final class AssistantBot_Plugin {
    const VERSION = '1.0.0';
    const OPTION_KEY = 'assistantbot_settings';

    public static function init() {
        add_shortcode('assistantbot_checkout', array(__CLASS__, 'checkout_shortcode'));
        add_action('admin_menu', array(__CLASS__, 'admin_menu'));
        add_action('init', array(__CLASS__, 'register_order_type'));
        add_action('admin_post_assistantbot_bank_confirm', array(__CLASS__, 'confirm_bank_payment'));
        add_action('admin_post_nopriv_assistantbot_checkout', array(__CLASS__, 'create_order'));
        add_action('admin_post_assistantbot_checkout', array(__CLASS__, 'create_order'));
        add_action('rest_api_init', array(__CLASS__, 'register_paypal_webhook'));
    }

    public static function activate() {
        if (!get_option(self::OPTION_KEY)) {
            add_option(self::OPTION_KEY, array(
                'paypal_email' => 'alenjusufovic@yahoo.com',
                'bank_name' => 'Raiffeisen Bank dd Bosna i Hercegovina',
                'bank_swift' => 'RZBABA2S',
                'bank_address' => 'Zmaja od Bosne 8, Sarajevo',
                'bank_iban' => '',
                'product_price' => '49.00',
                'currency' => 'EUR',
                'download_url' => '',
                'sms_webhook_url' => ''
            ));
        }
    }

    private static function settings() {
        return wp_parse_args(get_option(self::OPTION_KEY, array()), array(
            'paypal_email' => 'alenjusufovic@yahoo.com', 'bank_name' => '', 'bank_swift' => '',
            'bank_address' => '', 'bank_iban' => '', 'product_price' => '49.00',
            'currency' => 'EUR', 'download_url' => '', 'sms_webhook_url' => ''
        ));
    }

    public static function checkout_shortcode() {
        $settings = self::settings();
        ob_start(); ?>
        <div class="assistantbot-checkout">
            <h2><?php echo esc_html__('AssistantBot', 'assistantbot'); ?></h2>
            <p><?php echo esc_html__('Plaćanje aktivira isporuku pristupnih kodova emailom i SMS-om nakon potvrde.', 'assistantbot'); ?></p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="assistantbot_checkout">
                <?php wp_nonce_field('assistantbot_checkout'); ?>
                <p><label><?php echo esc_html__('Ime', 'assistantbot'); ?><br><input required name="customer_name" type="text"></label></p>
                <p><label><?php echo esc_html__('Email', 'assistantbot'); ?><br><input required name="customer_email" type="email"></label></p>
                <p><label><?php echo esc_html__('Broj telefona za SMS', 'assistantbot'); ?><br><input required name="customer_phone" type="tel"></label></p>
                <p><button type="submit"><?php echo esc_html__('Nastavi na plaćanje', 'assistantbot'); ?></button></p>
            </form>
            <p><?php echo esc_html__('Cijena:', 'assistantbot') . ' ' . esc_html($settings['product_price'] . ' ' . $settings['currency']); ?></p>
        </div>
        <?php return ob_get_clean();
    }

    public static function create_order() {
        check_admin_referer('assistantbot_checkout');
        $email = sanitize_email(wp_unslash($_POST['customer_email'] ?? ''));
        $name = sanitize_text_field(wp_unslash($_POST['customer_name'] ?? ''));
        $phone = sanitize_text_field(wp_unslash($_POST['customer_phone'] ?? ''));
        if (!is_email($email) || !$name || !$phone) wp_die(esc_html__('Podaci nisu ispravni.', 'assistantbot'));

        $settings = self::settings();
        $order_id = wp_insert_post(array('post_type' => 'assistantbot_order', 'post_status' => 'pending', 'post_title' => $name . ' - ' . $email));
        update_post_meta($order_id, '_assistantbot_email', $email);
        update_post_meta($order_id, '_assistantbot_phone', $phone);
        update_post_meta($order_id, '_assistantbot_payment', 'pending');
        update_post_meta($order_id, '_assistantbot_amount', $settings['product_price']);

        wp_safe_redirect(add_query_arg('order', $order_id, home_url('/assistantbot-payment/')));
        exit;
    }

    public static function register_order_type() {
        register_post_type('assistantbot_order', array('public' => false, 'show_ui' => true, 'label' => 'AssistantBot narudžbe', 'supports' => array('title')));
    }

    public static function payment_page() {
        $settings = self::settings();
        $order_id = absint($_GET['order'] ?? 0);
        if (!$order_id) return;
        $paypal_url = 'https://www.paypal.com/cgi-bin/webscr';
        ?>
        <div class="assistantbot-payment">
            <h2><?php echo esc_html__('Izaberite način plaćanja', 'assistantbot'); ?></h2>
            <form action="<?php echo esc_url($paypal_url); ?>" method="post">
                <input type="hidden" name="cmd" value="_xclick"><input type="hidden" name="business" value="<?php echo esc_attr($settings['paypal_email']); ?>">
                <input type="hidden" name="item_name" value="AssistantBot"><input type="hidden" name="amount" value="<?php echo esc_attr($settings['product_price']); ?>">
                <input type="hidden" name="currency_code" value="<?php echo esc_attr($settings['currency']); ?>"><input type="hidden" name="custom" value="<?php echo esc_attr($order_id); ?>">
                <input type="hidden" name="notify_url" value="<?php echo esc_url(rest_url('assistantbot/v1/paypal-ipn')); ?>">
                <button type="submit"><?php echo esc_html__('Plati putem PayPal', 'assistantbot'); ?></button>
            </form>
            <h3><?php echo esc_html__('Plaćanje putem banke', 'assistantbot'); ?></h3>
            <p><?php echo esc_html($settings['bank_name']); ?><br><?php echo esc_html__('IBAN:', 'assistantbot') . ' ' . esc_html($settings['bank_iban']); ?><br><?php echo esc_html__('SWIFT:', 'assistantbot') . ' ' . esc_html($settings['bank_swift']); ?><br><?php echo esc_html($settings['bank_address']); ?></p>
            <p><?php echo esc_html__('U opis plaćanja unesite broj narudžbe:', 'assistantbot') . ' ' . esc_html($order_id); ?></p>
        </div>
        <?php
    }

    public static function admin_menu() {
        add_options_page('AssistantBot', 'AssistantBot', 'manage_options', 'assistantbot', array(__CLASS__, 'settings_page'));
    }

    public static function confirm_bank_payment() {
        if (!current_user_can('manage_options')) wp_die(esc_html__('Nedozvoljeno.', 'assistantbot'));
        check_admin_referer('assistantbot_confirm_bank');
        self::fulfill_order(absint($_POST['order_id'] ?? 0), 'bank');
        wp_safe_redirect(admin_url('options-general.php?page=assistantbot'));
        exit;
    }

    private static function fulfill_order($order_id, $payment_method) {
        if (get_post_meta($order_id, '_assistantbot_payment', true) === 'paid') return;
        $email = get_post_meta($order_id, '_assistantbot_email', true);
        $phone = get_post_meta($order_id, '_assistantbot_phone', true);
        if (!$email || !$phone) return;
        $code = strtoupper(wp_generate_password(12, false, false));
        update_post_meta($order_id, '_assistantbot_payment', 'paid');
        update_post_meta($order_id, '_assistantbot_payment_method', sanitize_key($payment_method));
        update_post_meta($order_id, '_assistantbot_login_code', $code);
        $settings = self::settings();
        wp_mail($email, 'AssistantBot pristupni kod', "Vaš AssistantBot login kod je: {$code}\nDownload: {$settings['download_url']}");
        if ($settings['sms_webhook_url']) {
            wp_remote_post($settings['sms_webhook_url'], array('timeout' => 10, 'body' => array('phone' => $phone, 'message' => "AssistantBot kod: {$code}")));
        }
    }

    public static function register_paypal_webhook() {
        register_rest_route('assistantbot/v1', '/paypal-ipn', array('methods' => 'POST', 'callback' => array(__CLASS__, 'paypal_ipn'), 'permission_callback' => '__return_true'));
    }

    public static function paypal_ipn($request) {
        $body = $request->get_body();
        $verification = wp_remote_post('https://ipnpb.paypal.com/cgi-bin/webscr', array('timeout' => 15, 'body' => 'cmd=_notify-validate&' . $body));
        if (is_wp_error($verification) || trim(wp_remote_retrieve_body($verification)) !== 'VERIFIED') return new WP_Error('invalid_ipn', 'PayPal verification failed', array('status' => 400));
        parse_str($body, $data);
        $settings = self::settings();
        if (($data['receiver_email'] ?? '') !== $settings['paypal_email'] || ($data['payment_status'] ?? '') !== 'Completed') return new WP_Error('invalid_payment', 'Payment not accepted', array('status' => 400));
        self::fulfill_order(absint($data['custom'] ?? 0), 'paypal');
        return new WP_REST_Response(array('status' => 'accepted'), 200);
    }

    public static function settings_page() {
        if (!current_user_can('manage_options')) return;
        $settings = self::settings();
        if (isset($_POST['assistantbot_save']) && check_admin_referer('assistantbot_settings')) {
            foreach (array_keys($settings) as $key) $settings[$key] = sanitize_text_field(wp_unslash($_POST[$key] ?? ''));
            update_option(self::OPTION_KEY, $settings);
            echo '<div class="updated"><p>AssistantBot postavke su sačuvane.</p></div>';
        }
        ?>
        <div class="wrap"><h1>AssistantBot</h1><form method="post"><?php wp_nonce_field('assistantbot_settings'); ?>
        <?php foreach (array('paypal_email'=>'PayPal email','bank_name'=>'Naziv banke','bank_iban'=>'IBAN','bank_swift'=>'SWIFT','bank_address'=>'Adresa banke','product_price'=>'Cijena','currency'=>'Valuta','download_url'=>'URL za download','sms_webhook_url'=>'SMS webhook URL') as $key=>$label): ?>
            <p><label><strong><?php echo esc_html($label); ?></strong><br><input class="regular-text" name="<?php echo esc_attr($key); ?>" value="<?php echo esc_attr($settings[$key]); ?>"></label></p>
        <?php endforeach; ?><p><button class="button button-primary" name="assistantbot_save" value="1">Sačuvaj</button></p></form>
        <h2>Bankovne uplate na čekanju</h2>
        <?php foreach (get_posts(array('post_type' => 'assistantbot_order', 'post_status' => 'pending', 'numberposts' => 20)) as $order): ?>
            <?php if (get_post_meta($order->ID, '_assistantbot_payment', true) !== 'paid'): ?>
                <p><?php echo esc_html($order->post_title); ?> <form style="display:inline" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"><input type="hidden" name="action" value="assistantbot_bank_confirm"><input type="hidden" name="order_id" value="<?php echo esc_attr($order->ID); ?>"><?php wp_nonce_field('assistantbot_confirm_bank'); ?><button class="button">Potvrdi uplatu i pošalji kod</button></form></p>
            <?php endif; ?>
        <?php endforeach; ?></div>
        <?php
    }
}

register_activation_hook(__FILE__, array('AssistantBot_Plugin', 'activate'));
AssistantBot_Plugin::init();
add_filter('the_content', function ($content) {
    return is_page('assistantbot-payment') ? $content . AssistantBot_Plugin::payment_page() : $content;
});
