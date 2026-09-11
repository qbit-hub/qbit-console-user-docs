# امنیت

Qbit Console یک control plane برای سرورهای شخص ثالث است. مرزهای امنیتی آن بر تفکیک identity، authorization و credential material استوارند.

## ورود و session

ورود از طریق Qbit Account و OIDC Authorization Code + PKCE انجام می‌شود. API مرورگر فقط Bearer token ارسال می‌کند و cookie credentials به API Qbit ضمیمه نمی‌شوند.

## مجوزها

Backend مرجع نهایی authorization است. وجود یک route، شناسه Workspace یا نمایش یک action در UI مدرک مجوز نیست.

برای عملیات زنده سرور، capabilityهای Agent نیز شرط اجرای feature هستند، اما capability جای authorization tenant/user را نمی‌گیرد. Qbit باید قبل از dispatch عملیات scope و مجوز actor را در control plane بررسی کند.

## credentialها

هنگام ثبت سرور:

- رمز عبور وارد نکنید؛
- private key وارد نکنید؛
- access token یا API key خام وارد نکنید؛
- در صورت نیاز فقط **credential reference** غیرشفاف ثبت کنید.

مقصدهای webhook نیز endpoint/signing valueهای حساس را به شکل write-only یا masked مدیریت می‌کنند؛ انتظار نمایش secret خام در readهای بعدی نداشته باشید.

## چند حساب

snapshotهای هویتی حساب‌های اضافی فقط در `sessionStorage` مرورگر نگهداری می‌شوند، نه `localStorage`. هنگام تغییر حساب، Qbit query state را بر اساس subject تفکیک و بازسازی می‌کند.

## عملیات تایپ‌شده

عملیات عادی سرور از APIهای typed و versioned استفاده می‌کنند. UI برای Docker lifecycle یا جمع‌آوری متریک تازه raw shell command تولید نمی‌کند. operation history شامل state و نتیجه/خطای bounded است و correlation ID می‌تواند برای troubleshooting استفاده شود.

لغو operation نیز یک درخواست کنترل‌شده است؛ فقط برای stateهای مجاز UI ارائه می‌شود و معادل kill کردن یک process ناشناخته از مرورگر نیست.

## ترمینال privileged

ترمینال از typed automation جداست و برای troubleshooting تعاملی روی سرور مشتری استفاده می‌شود.

- مرورگر machine credential Agent یا private key SSH را نمایش نمی‌دهد؛
- WebSocket ticket یک‌بارمصرف و کوتاه‌عمر است و نباید در log/support message کپی شود؛
- bytes ترمینال موقتی هستند و در query cache Console ذخیره نمی‌شوند؛
- audit ساخت نشست فقط metadata sanitize‌شده مانند tenant، actor، server، correlation و شناسه نشست را ثبت می‌کند؛
- terminal input/output، command output، credential و secret ticket جزو audit payload مجاز نیستند.

:::warning
ترمینال می‌تواند تغییر واقعی روی سرور ریموت ایجاد کند. قبل از اتصال، Workspace و server scope را بررسی کنید و پس از اتمام troubleshooting صریحاً disconnect کنید.
:::

## عملیات روی سرور

مشاهده resource snapshot/history، ruleهای alert یا غیرفعال‌کردن inventory رکورد به‌تنهایی command مخرب روی ماشین اجرا نمی‌کند. در مقابل، actionهای صریح مانند **دریافت متریک تازه**، `start/stop/restart` کانتینر و اتصال ترمینال عملیات واقعی کنترل‌پلین هستند و باید confirmation/state آن‌ها را بررسی کنید.

Qbit Console ترمینال یا lifecycle داخلی میزبان‌ها/کانتینرهای خود Qbit را در اختیار کاربر قرار نمی‌دهد؛ عملیات داخلی Qbit در plane مستقل Dokploy باقی می‌ماند.

:::danger
هیچ secret خامی را در نام سرور، remote reference، tags، labels، فیلد credential reference، گزارش پشتیبانی یا screenshot ترمینال ذخیره/ارسال نکنید.
:::

صفحه مرتبط: [عملیات ریموت و ترمینال](/guide/remote-operations).
