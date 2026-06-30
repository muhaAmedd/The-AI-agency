<?php
/**
 * Contact Form Mailer — The AI Agency
 * Drop this file in your Hostinger public_html root (same folder as index.html).
 * No libraries needed — uses PHP's built-in mail().
 */

// ── Security headers ─────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Honeypot anti-spam (hidden field, bots fill it, humans don't) ─
if (!empty($_POST['website'])) {
    // Silently succeed so bots think it worked
    echo json_encode(['success' => true]);
    exit;
}

// ── Sanitize & validate ──────────────────────────────────────────
function clean_string($val) {
    // Remove newlines to prevent Email Header Injection
    $val = preg_replace('/[\r\n]+/', ' ', $val);
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function clean_text($val) {
    // Allow newlines for the message body
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$name    = clean_string($_POST['full_name']   ?? '');
$company = clean_string($_POST['company']     ?? '');
$phone   = clean_string($_POST['phone']       ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = clean_string($_POST['subject']     ?? '');
$message = clean_text($_POST['message']     ?? '');

$errors = [];
if (empty($name))    $errors[] = 'Full name is required.';
if (!$email)         $errors[] = 'A valid email address is required.';
if (empty($phone))   $errors[] = 'Phone number is required.';
if (empty($subject)) $errors[] = 'Subject is required.';
if (empty($message)) $errors[] = 'Message is required.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ── Destination ──────────────────────────────────────────────────
$to          = 'Amr8818@gmail.com';
$emailSubject = "New Inquiry: {$subject} — The AI Agency";

// ── Build HTML email body ────────────────────────────────────────
$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body      { margin:0; padding:0; background:#f4f4f8; font-family:'Segoe UI',Arial,sans-serif; }
  .wrap     { max-width:600px; margin:32px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
  .header   { background:linear-gradient(135deg,#44008b,#e54ed0); padding:36px 40px; text-align:center; }
  .header h1{ color:#fff; margin:0; font-size:24px; letter-spacing:4px; text-transform:uppercase; }
  .header p { color:rgba(255,255,255,0.7); margin:6px 0 0; font-size:12px; letter-spacing:2px; }
  .body     { padding:36px 40px; }
  .row      { margin-bottom:20px; }
  .label    { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9f45b0; font-weight:600; margin-bottom:4px; }
  .value    { font-size:15px; color:#1a1a2e; line-height:1.6; }
  .divider  { height:1px; background:#f0e6f8; margin:24px 0; }
  .msg-box  { background:#faf5ff; border-left:3px solid #e54ed0; border-radius:0 8px 8px 0; padding:16px 20px; color:#1a1a2e; font-size:15px; line-height:1.7; }
  .footer   { background:#faf5ff; padding:20px 40px; text-align:center; font-size:11px; color:#aaa; letter-spacing:1px; }
  .reply-btn{ display:inline-block; margin-top:24px; padding:12px 32px; background:linear-gradient(135deg,#44008b,#e54ed0); color:#fff; text-decoration:none; border-radius:50px; font-size:13px; letter-spacing:2px; text-transform:uppercase; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>The AI Agency</h1>
    <p>New Contact Form Submission</p>
  </div>
  <div class="body">
    <div class="row">
      <div class="label">Full Name</div>
      <div class="value">{$name}</div>
    </div>
    <div class="row">
      <div class="label">Company / Clinic</div>
      <div class="value">{$company}</div>
    </div>
    <div class="row">
      <div class="label">Phone</div>
      <div class="value">{$phone}</div>
    </div>
    <div class="row">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:{$email}" style="color:#9f45b0;">{$email}</a></div>
    </div>
    <div class="row">
      <div class="label">Subject / Service</div>
      <div class="value">{$subject}</div>
    </div>
    <div class="divider"></div>
    <div class="row">
      <div class="label">Message</div>
      <div class="msg-box">{$message}</div>
    </div>
    <div style="text-align:center;">
      <a href="mailto:{$email}" class="reply-btn">Reply to {$name}</a>
    </div>
  </div>
  <div class="footer">
    Sent from theaiagency.com contact form &nbsp;·&nbsp; {$_SERVER['REMOTE_ADDR']}
  </div>
</div>
</body>
</html>
HTML;

// ── Plain-text fallback ──────────────────────────────────────────
$plain = "New inquiry via The AI Agency website\n\n"
       . "Name:    {$name}\n"
       . "Company: {$company}\n"
       . "Phone:   {$phone}\n"
       . "Email:   {$email}\n"
       . "Subject: {$subject}\n\n"
       . "Message:\n{$message}";

// ── Mail headers ─────────────────────────────────────────────────
$boundary = md5(uniqid(time()));

$headers  = "From: The AI Agency <noreply@{$_SERVER['HTTP_HOST']}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
$body .= $plain . "\r\n";
$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
$body .= $html . "\r\n";
$body .= "--{$boundary}--";

// ── Send ─────────────────────────────────────────────────────────
$sent = mail($to, $emailSubject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true,  'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail server error. Please try again.']);
}
