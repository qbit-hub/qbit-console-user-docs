# رفع اشکال

این صفحه خطاهای متداول Qbit Console را از مشکلات خود سرور ریموت جدا می‌کند.

## پنل دوباره درخواست ورود می‌کند

- session حساب را در **Settings** بررسی کنید؛
- در صورت منقضی‌شدن token دوباره از Qbit Account وارد شوید؛
- اگر چند حساب دارید، مطمئن شوید حساب فعال همان حسابی است که به Workspace دسترسی دارد.

## Workspace یا سرور دیده نمی‌شود

- Workspace فعال را از app bar بررسی کنید؛
- عضویت و role خود را بررسی کنید؛
- اگر حساب را عوض کرده‌اید، به Workspace معتبر حساب جدید بروید؛
- نمایش ندادن resource می‌تواند نتیجه authorization backend باشد.

## API در دسترس نیست

پیام «ارتباط با API کیوبیت برقرار نشد» با `Unavailable` بودن خود سرور متفاوت است. در این حالت اتصال مرورگر به Qbit API یا وضعیت سرویس پنل را بررسی کنید.

## Agent یا قابلیت لازم در دسترس نیست

اگر تب **مانیتورینگ**، **کانتینرها** یا **ترمینال** پیام unsupported نشان می‌دهد:

1. connection و enrollment سرور را بررسی کنید؛
2. مطمئن شوید Agent همان سرور online و سازگار است؛
3. capability موردنیاز را بررسی کنید (`monitor`، Docker read/lifecycle یا `terminal`)؛
4. صفحه را به raw shell fallback تبدیل نکنید؛ نبود capability یعنی operation مربوط نباید dispatch شود.

## snapshot منابع نمایش داده نمی‌شود

- connection و enrollment سرور را بررسی کنید؛
- زمان آخرین snapshot را بررسی کنید؛
- `Stale` یعنی آخرین داده موجود قدیمی است، نه اینکه پنل polling جدید اجرا کرده باشد؛
- اگر هیچ snapshot پذیرفته‌شده‌ای وجود ندارد، صفحه جزئیات نمی‌تواند مقدار لحظه‌ای بسازد؛
- اگر capability `monitor` وجود دارد و داده تازه می‌خواهید، از **دریافت متریک تازه** استفاده کنید؛ این action یک typed operation ایجاد می‌کند.

## operation روی `Failed` یا `Timed out` مانده است

- نوع operation و state آن را در تب **عملیات** بررسی کنید؛
- نتیجه/خطای امن نمایش‌داده‌شده را یادداشت کنید؛
- correlation ID را برای گزارش پشتیبانی نگه دارید؛
- برای operation `Queued` یا `Running` فقط در صورت نمایش action **لغو عملیات** درخواست cancellation ثبت کنید؛
- `Cancel requested` به معنی پایان فوری operation نیست؛ منتظر state نهایی بمانید؛
- همان operation را با raw shell یا Docker command دستی از مرورگر تکرار نکنید.

## کانتینر action در دسترس نیست

UI actionها را بر اساس state کانتینر و capability lifecycle محدود می‌کند. `dead` یا `unknown` action lifecycle ندارد. همچنین `start/stop/restart` فقط در stateهای مجاز نمایش داده می‌شود. اگر action نمایش داده نمی‌شود، state و capability را بررسی کنید؛ آن را با command خام دور نزنید.

## ترمینال وصل نمی‌شود یا قطع شده است

- وجود capability `terminal` را بررسی کنید؛
- اگر پیام expired دیده می‌شود، نشست جدید بسازید؛
- runtime فعلی Agent به‌طور پیش‌فرض PTY idle را بعد از ۱۰ دقیقه و حداکثر عمر PTY را بعد از ۳۰ دقیقه می‌بندد؛ expiry صادرشده توسط control plane می‌تواند زودتر اعمال شود؛
- اگر connection lost رخ داده، وضعیت Agent/network را بررسی و سپس نشست جدید ایجاد کنید؛
- WebSocket ticket، credential، private key یا terminal output حساس را در گزارش خطا قرار ندهید.

## اعلان ارسال نشده است

1. enabled بودن rule را بررسی کنید؛
2. destination binding rule را بررسی کنید؛
3. delivery history را باز کنید؛
4. attempt history را برای status و خطا بررسی کنید؛
5. در صورت داشتن مجوز، فقط در شرایط مناسب administrative replay ثبت کنید.

Replay فقط delivery اعلان را تکرار می‌کند و operation روی سرور ایجاد نمی‌کند.

## بعد از تغییر زبان تاریخ‌ها مناسب نیستند

تقویم می‌تواند مستقل از زبان override شده باشد. در **Settings** تقویم را روی «پیروی از زبان» برگردانید یا Gregorian/Jalali دلخواه را صریحاً انتخاب کنید.

## برای گزارش خطا چه اطلاعاتی مفید است؟

- route یا صفحه‌ای که خطا در آن رخ داده؛
- زمان تقریبی رخداد؛
- Workspace و server identifier غیرمحرمانه؛
- operation ID و correlation ID در صورت نمایش؛
- state و متن خطای امن؛
- بدون ارسال password، token، private key، WebSocket ticket، signing secret یا محتوای محرمانه ترمینال.

صفحه مرتبط: [عملیات ریموت و ترمینال](/guide/remote-operations) و [امنیت](/guide/security).
