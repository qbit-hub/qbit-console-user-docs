# هشدارها و اعلان‌ها

Qbit برای resource snapshotهای پذیرفته‌شده ruleهای هشدار نگه می‌دارد. ایجاد یا ویرایش rule فقط metadata کنترلی Qbit را تغییر می‌دهد و خودش عملیات remediation یا command روی سرور اجرا نمی‌کند.

## ساخت rule هشدار

از صفحه سرور وارد **هشدارهای منابع** شوید و **ساخت rule هشدار** را انتخاب کنید.

فیلدهای فعلی rule:

- نام rule؛
- metric؛
- operator؛
- threshold؛
- severity؛
- enabled/disabled.

Metricهای فعلی شامل CPU، حافظه، دیسک و load averageهای ۱، ۵ و ۱۵ دقیقه هستند. Operatorها شامل بزرگ‌تر، بزرگ‌تر یا مساوی، کوچک‌تر و کوچک‌تر یا مساوی هستند.

## state و event history

برای هر rule، Qbit می‌تواند state فعلی و eventهای `Triggered` و `Resolved` را نمایش دهد. event history ممکن است حتی بعد از حذف rule نیز برای audit باقی بماند.

در صفحه جزئیات سرور، تب **هشدار و ارسال‌ها** یک خلاصه از تعداد ruleها، هشدارهای فعال، deliveryهای در انتظار/ناموفق و وضعیت‌های اخیر ارائه می‌کند. این view از state ثبت‌شده استفاده می‌کند و خودش command روی سرور اجرا نمی‌کند.

## مقصدهای اعلان

در سطح Workspace می‌توانید webhook destination مدیریت کنید. مقادیر endpoint و signing secret به‌صورت write-only/محافظت‌شده مدیریت می‌شوند و readهای بعدی نباید secret خام را نمایش دهند.

برای اتصال اعلان به یک rule:

1. مقصد اعلان را در Workspace ایجاد کنید؛
2. وارد صفحه rule موردنظر شوید؛
3. بخش **Notifications** را باز کنید؛
4. destinationهای موردنظر را به rule bind کنید.

## سابقه delivery

صفحه **سوابق ارسال هشدار** deliveryها را با pagination نمایش می‌دهد. وضعیت‌های فعلی قابل مشاهده شامل `Pending`، `In progress`، `Retry scheduled`، `Succeeded`، `Failed` و `Suppressed` هستند. از صفحه جزئیات delivery می‌توانید attempt history را ببینید.

اگر مجوز لازم را داشته باشید، درخواست administrative replay نیز از همان صفحه قابل ثبت است.

:::warning
Replay فقط delivery اعلان را دوباره تلاش می‌کند. این عملیات remediation سرور نیست و هیچ typed remote operation، raw shell یا Docker action روی سرور ایجاد نمی‌کند.
:::

برای وضعیت خود operationهای سرور، [عملیات ریموت و ترمینال](/guide/remote-operations) را ببینید.
