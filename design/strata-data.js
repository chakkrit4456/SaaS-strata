window.STRATA = (function () {
const T = {
features:['ฟีเจอร์','Features'],pricing:['ราคา','Pricing'],about:['เกี่ยวกับเรา','About'],contact:['ติดต่อ','Contact'],login:['เข้าสู่ระบบ','Log in'],startFree:['เริ่มใช้ฟรี','Start free'],
heroKicker:['สำหรับร้านค้า ร้านอาหาร และธุรกิจบริการ','For shops, restaurants and service businesses'],
heroTitle:['หลังร้านทั้งหมดของคุณ ในระบบเดียว','Your whole back office, in one system'],
heroSub:['จัดการสินค้า สต็อก การขาย ใบแจ้งหนี้ และลูกค้า จากทุกสาขา รองรับภาษาไทย เงินบาท และพร้อมเพย์','Manage products, stock, sales, invoices and customers across every branch. Built for Thai baht, Thai language and PromptPay.'],
seePricing:['ดูแพ็กเกจ','See pricing'],heroNote:['ทดลองใช้ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต','14-day free trial. No credit card required.'],
modulesTitle:['ทุกอย่างที่ธุรกิจขนาดเล็กต้องใช้','Everything a small business runs on'],
modulesSub:['เปิดใช้เฉพาะโมดูลที่ต้องการ ข้อมูลทุกส่วนเชื่อมถึงกัน','Turn on what you need. Every module shares the same data.'],
ctaTitle:['เริ่มต้นวันนี้ ด้วยแพ็กเกจฟรี','Start today on the free plan'],ctaSub:['อัปเกรดเมื่อธุรกิจพร้อม ยกเลิกได้ทุกเมื่อ','Upgrade when you are ready. Cancel anytime.'],
terms:['ข้อกำหนดการใช้งาน','Terms'],privacy:['นโยบายความเป็นส่วนตัว','Privacy'],rights:['© 2569 Strata-softwareservice','© 2026 Strata-softwareservice'],
pricingTitle:['แพ็กเกจที่โตไปพร้อมธุรกิจ','Plans that grow with your business'],pricingSub:['เริ่มฟรี อัปเกรดเมื่อพร้อม ยกเลิกได้ทุกเมื่อ','Start free, upgrade when ready, cancel anytime.'],
monthly:['รายเดือน','Monthly'],annual:['รายปี','Annual'],save2:['ฟรี 2 เดือน','2 months free'],perMonth:['/เดือน','/mo'],perYear:['/ปี','/yr'],choose:['เลือกแพ็กเกจ','Choose plan'],currentPlan:['แพ็กเกจปัจจุบัน','Current plan'],popular:['ยอดนิยม','Most popular'],
priceNote:['ราคารวม VAT 7% เป็นราคาตัวอย่าง ผู้ดูแลแพลตฟอร์มปรับได้','Prices include 7% VAT. Example pricing, configurable by the platform admin.'],compare:['เปรียบเทียบแพ็กเกจ','Compare plans'],
welcome:['ยินดีต้อนรับกลับ','Welcome back'],loginSub:['เข้าสู่ระบบเพื่อจัดการธุรกิจของคุณ','Log in to manage your business'],email:['อีเมล','Email'],password:['รหัสผ่าน','Password'],remember:['จดจำฉันไว้','Remember me'],forgot:['ลืมรหัสผ่าน?','Forgot password?'],noAcc:['ยังไม่มีบัญชี?','No account yet?'],haveAcc:['มีบัญชีแล้ว?','Already have an account?'],register:['สมัครใช้งาน','Create account'],registerSub:['เริ่มทดลองใช้ Pro ฟรี 14 วัน','Start your free 14-day Pro trial'],fullName:['ชื่อ-นามสกุล','Full name'],bizName:['ชื่อธุรกิจ','Business name'],agree:['ฉันยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว','I agree to the Terms and Privacy Policy'],pwHint:['อย่างน้อย 10 ตัวอักษร','At least 10 characters'],
authPanel:['ข้อมูลของแต่ละธุรกิจแยกจากกันอย่างปลอดภัย','Each business’s data is isolated and private.'],authP1:['สิทธิ์ผู้ใช้ 5 ระดับ ตั้งแต่เจ้าของถึงผู้ดูข้อมูล','Five roles, from owner to read-only'],authP2:['ยืนยันตัวตนสองขั้นตอน (TOTP)','Optional two-factor authentication'],authP3:['ติดตั้งบนเซิร์ฟเวอร์ของคุณเองได้','Self-hostable on your own Linux server'],
onbTitle:['ตั้งค่าธุรกิจของคุณ','Set up your business'],step:['ขั้นตอน','Step'],bizType:['ประเภทธุรกิจ','Business type'],taxId:['เลขประจำตัวผู้เสียภาษี (ไม่บังคับ)','Tax ID (optional)'],currency:['สกุลเงิน','Currency'],timezone:['เขตเวลา','Time zone'],branchName:['ชื่อสาขา','Branch name'],address:['ที่อยู่','Address'],warehouseName:['ชื่อคลังสินค้า','Warehouse name'],next:['ถัดไป','Continue'],back:['ย้อนกลับ','Back'],
trialNote:['ทุกแพ็กเกจเริ่มด้วยการทดลองใช้ Pro ฟรี 14 วัน','Every plan starts with a free 14-day Pro trial'],readyTitle:['เรียบร้อย ธุรกิจของคุณพร้อมใช้งาน','You’re all set'],readySub:['ระบบสร้างองค์กร สาขาแรก และสิทธิ์เจ้าของให้คุณแล้ว','Your organization, first branch and owner access are ready.'],goDash:['ไปที่แดชบอร์ด','Go to dashboard'],
dashboard:['ภาพรวม','Dashboard'],pos:['ขายหน้าร้าน','Sales / POS'],products:['สินค้า','Products'],inventory:['สต็อกและคลัง','Inventory'],customers:['ลูกค้า','Customers'],invoices:['ใบแจ้งหนี้','Invoices'],reports:['รายงาน','Reports'],billing:['แพ็กเกจและการชำระ','Billing & plan'],settings:['ตั้งค่า','Settings'],
gCommerce:['การขาย','Commerce'],gInsight:['วิเคราะห์','Insights'],gOrg:['องค์กร','Organization'],search:['ค้นหา…','Search…'],notifications:['การแจ้งเตือน','Notifications'],markAll:['อ่านทั้งหมด','Mark all read'],more:['เพิ่มเติม','More'],logout:['ออกจากระบบ','Log out'],adminLink:['ผู้ดูแลแพลตฟอร์ม','Platform admin'],publicSite:['เว็บไซต์','Public site'],
greet:['สวัสดีตอนเช้า คุณนิดา','Good morning, Nida'],today:['วันนี้','Today'],d7:['7 วัน','7 days'],d30:['30 วัน','30 days'],revenue:['ยอดขาย','Revenue'],orders:['คำสั่งซื้อ','Orders'],aov:['ยอดเฉลี่ยต่อบิล','Avg. order value'],gp:['กำไรขั้นต้น (ประมาณ)','Est. gross profit'],vsPrev:['เทียบช่วงก่อน','vs previous period'],salesTrend:['ยอดขายรายวัน','Revenue'],topProducts:['สินค้าขายดี','Top products'],lowStock:['สินค้าใกล้หมด','Low stock'],outstanding:['ค้างชำระ','Outstanding invoices'],recentSales:['การขายล่าสุด','Recent sales'],viewAll:['ดูทั้งหมด','View all'],newSale:['ขายใหม่','New sale'],reorder:['สั่งซื้อ','Reorder'],left:['เหลือ','left'],sold:['ชิ้น','sold'],
addProduct:['เพิ่มสินค้า','Add product'],importCsv:['นำเข้า CSV','Import CSV'],export:['ส่งออก','Export'],all:['ทั้งหมด','All'],colProduct:['สินค้า','Product'],category:['หมวดหมู่','Category'],price:['ราคาขาย','Price'],cost:['ต้นทุน','Cost'],stock:['คงเหลือ','Stock'],status:['สถานะ','Status'],inStock:['พร้อมขาย','In stock'],low:['ใกล้หมด','Low'],out:['หมด','Out of stock'],mto:['ทำตามสั่ง','Made to order'],productsUsed:['สินค้าที่ใช้ไป','Products used'],productName:['ชื่อสินค้า','Product name'],barcode:['บาร์โค้ด','Barcode'],supplier:['ผู้จำหน่าย','Supplier'],photos:['รูปภาพ','Photos'],dropPhoto:['ลากรูปมาวาง หรือคลิกเพื่ออัปโหลด','Drop images or click to upload'],reorderPoint:['จุดสั่งซื้อซ้ำ','Reorder point'],cancel:['ยกเลิก','Cancel'],save:['บันทึก','Save'],trackStock:['ติดตามสต็อกสินค้านี้','Track stock for this product'],itemsN:['รายการ','items'],
tabStock:['ยอดคงเหลือ','Stock levels'],tabMoves:['ความเคลื่อนไหว','Movements'],tabPO:['ใบสั่งซื้อ','Purchase orders'],warehouse:['คลัง','Warehouse'],onHand:['คงเหลือ','On hand'],value:['มูลค่า','Value'],adjust:['ปรับสต็อก','Adjust'],transfer:['โอนย้าย','Transfer'],stockValue:['มูลค่าสต็อกรวม','Total stock value'],lowCount:['ต่ำกว่าจุดสั่งซื้อ','Below reorder point'],pendingPO:['ใบสั่งซื้อรอรับ','Open purchase orders'],date:['วันที่','Date'],type:['ประเภท','Type'],qty:['จำนวน','Qty'],ref:['อ้างอิง','Reference'],by:['โดย','By'],poNo:['เลขที่','PO no.'],expected:['กำหนดรับ','Expected'],total:['ยอดรวม','Total'],newPO:['สร้างใบสั่งซื้อ','New PO'],
tabPos:['ขาย','Register'],tabHistory:['ประวัติการขาย','Order history'],cart:['บิลปัจจุบัน','Current sale'],emptyCart:['แตะสินค้าเพื่อเพิ่มลงบิล','Tap a product to add it'],subtotal:['ยอดก่อนภาษี','Subtotal'],vatIncl:['VAT 7% (รวมในราคา)','VAT 7% (included)'],grandTotal:['ยอดชำระ','Total'],payWith:['ชำระด้วย','Payment'],cash:['เงินสด','Cash'],promptpay:['พร้อมเพย์','PromptPay'],card:['บัตร','Card'],transferPay:['โอนเงิน','Transfer'],charge:['รับชำระ','Charge'],walkIn:['ลูกค้าทั่วไป','Walk-in customer'],paidOk:['รับชำระเรียบร้อย','Payment received'],printReceipt:['พิมพ์ใบเสร็จ','Print receipt'],newSaleBtn:['เริ่มบิลใหม่','New sale'],saleNo:['เลขที่บิล','Sale no.'],time:['เวลา','Time'],cashier:['พนักงาน','Cashier'],method:['ช่องทาง','Method'],
addCustomer:['เพิ่มลูกค้า','Add customer'],lifetime:['ยอดซื้อสะสม','Lifetime spend'],balance:['ค้างชำระ','Outstanding'],visits:['จำนวนบิล','Orders'],lastVisit:['ซื้อล่าสุด','Last purchase'],contactInfo:['ข้อมูลติดต่อ','Contact'],timeline:['กิจกรรม','Activity'],notes:['บันทึก','Notes'],addNote:['เพิ่มบันทึก…','Add a note…'],phone:['โทรศัพท์','Phone'],createInvoice:['สร้างใบแจ้งหนี้','Create invoice'],memberSince:['ลูกค้าตั้งแต่','Customer since'],
newInvoice:['สร้างใบแจ้งหนี้','New invoice'],draft:['ฉบับร่าง','Draft'],sent:['ส่งแล้ว','Sent'],paid:['ชำระแล้ว','Paid'],overdue:['เกินกำหนด','Overdue'],invNo:['เลขที่','Invoice'],customer:['ลูกค้า','Customer'],issued:['วันที่ออก','Issued'],due:['ครบกำหนด','Due'],amount:['จำนวนเงิน','Amount'],downloadPdf:['ดาวน์โหลด PDF','Download PDF'],sendReminder:['ส่งการแจ้งเตือน','Send reminder'],recordPayment:['บันทึกการชำระ','Record payment'],invoiceDoc:['ใบแจ้งหนี้ / ใบกำกับภาษี','Invoice / Tax invoice'],billTo:['เรียกเก็บจาก','Bill to'],desc:['รายการ','Description'],unitPrice:['ราคาต่อหน่วย','Unit price'],vat:['ภาษีมูลค่าเพิ่ม 7%','VAT 7%'],payInfo:['ชำระผ่านพร้อมเพย์ 0-1055-66012-34-5 หรือโอนเข้าบัญชีกสิกรไทย 123-4-56789-0','Pay via PromptPay 0-1055-66012-34-5 or transfer to KBank 123-4-56789-0'],totalOutstanding:['ค้างรับทั้งหมด','Total outstanding'],collected:['รับชำระเดือนนี้','Collected this month'],close:['ปิด','Close'],
reportsSub:['คำนวณจากการขายที่บันทึกไว้จริง','Calculated from your recorded sales'],exportPdf:['PDF','PDF'],exportCsv:['CSV','CSV'],revTrend:['แนวโน้มยอดขาย','Revenue trend'],byCategory:['ยอดขายตามหมวดหมู่','Sales by category'],byBranch:['เปรียบเทียบสาขา','Branch comparison'],branch:['สาขา','Branch'],share:['สัดส่วน','Share'],newCustomers:['ลูกค้าใหม่','New customers'],gpNote:['กำไรขั้นต้นประมาณจากต้นทุนสินค้าที่บันทึกไว้','Gross profit is estimated from recorded product costs.'],rangeLabel:['1–24 ต.ค. 2569','Oct 1–24, 2026'],
billingSub:['จัดการแพ็กเกจ การใช้งาน และการชำระเงิน','Manage your plan, usage and payments'],renews:['ต่ออายุ','Renews'],users:['ผู้ใช้','Users'],branches:['สาขา','Branches'],changePlan:['เปลี่ยนแพ็กเกจ','Change plan'],cancelSub:['ยกเลิกการสมัคร','Cancel subscription'],payMethod:['วิธีชำระเงิน','Payment method'],billHistory:['ประวัติการเรียกเก็บ','Billing history'],
sandbox:['ระบบรับชำระเงินอยู่ในโหมดทดสอบ (sandbox) ยังไม่ได้ยืนยันการรับชำระจริง','Payment gateway is in sandbox mode. Live payment processing has not been verified.'],manualPay:['โอนผ่านธนาคาร (ตรวจสอบโดยทีมงาน)','Bank transfer (verified manually)'],update:['แก้ไข','Update'],receiptDl:['ใบเสร็จ','Receipt'],
tOrg:['องค์กร','Organization'],tStaff:['พนักงาน','Staff'],tBranches:['สาขา','Branches'],tSecurity:['ความปลอดภัย','Security'],orgProfile:['ข้อมูลองค์กร','Organization profile'],language:['ภาษาเริ่มต้น','Default language'],invoicePrefix:['รหัสนำหน้าใบแจ้งหนี้','Invoice prefix'],invite:['เชิญพนักงาน','Invite staff'],role:['บทบาท','Role'],active:['ใช้งาน','Active'],invited:['รอตอบรับ','Invited'],suspended:['ระงับ','Suspended'],trial:['ทดลองใช้','Trial'],pastDue:['ค้างชำระ','Past due'],
twoFA:['ยืนยันตัวตนสองขั้นตอน (TOTP)','Two-factor authentication (TOTP)'],twoFADesc:['ขอรหัสจากแอปยืนยันตัวตนทุกครั้งที่เข้าสู่ระบบ','Require an authenticator code at every login.'],sessions:['อุปกรณ์ที่เข้าสู่ระบบอยู่','Active sessions'],revoke:['ยกเลิก','Revoke'],thisDevice:['อุปกรณ์นี้','This device'],addBranch:['เพิ่มสาขา','Add branch'],staffN:['พนักงาน','staff'],lastActive:['ใช้งานล่าสุด','Last active'],
aOverview:['ภาพรวม','Overview'],aUsers:['ผู้ใช้','Users'],aOrgs:['องค์กร','Organizations'],aPlans:['แพ็กเกจ','Plans'],aPayments:['การชำระเงิน','Payments'],aHealth:['สถานะระบบ','System health'],aAudit:['บันทึกการตรวจสอบ','Audit logs'],aSettings:['ตั้งค่า','Settings'],
totalUsers:['ผู้ใช้ทั้งหมด','Total users'],totalOrgs:['องค์กร','Organizations'],trials:['กำลังทดลองใช้','On trial'],activePaid:['ชำระเงินอยู่','Active paid'],churn:['อัตรายกเลิก (30 วัน)','Churn (30d)'],failedPay:['ชำระไม่สำเร็จ','Failed payments'],mrrTrend:['MRR รายเดือน','MRR by month'],planMix:['สัดส่วนแพ็กเกจ','Plan distribution'],billingEvents:['เหตุการณ์การเรียกเก็บล่าสุด','Recent billing events'],operational:['ปกติ','Operational'],warning:['ควรตรวจสอบ','Attention'],backToApp:['กลับไปที่แอป','Back to app'],suspend:['ระงับ','Suspend'],restore:['คืนสถานะ','Restore'],owner:['เจ้าของ','Owner'],created:['สร้างเมื่อ','Created'],plan:['แพ็กเกจ','Plan'],searchOrgs:['ค้นหาองค์กร อีเมล หรือ ID…','Search organizations, emails or IDs…'],platformAdmin:['ผู้ดูแลแพลตฟอร์ม','Platform admin'],orgsSub:['องค์กรที่ใช้งานบนแพลตฟอร์ม','Businesses on the platform'],adminSub:['ตัวเลขจากฐานข้อมูลการเรียกเก็บเงิน อัปเดต 10:42 น.','From billing records, updated 10:42'],
};
const modules = [
 {ic:'package',t:['สินค้า','Products'],d:['SKU บาร์โค้ด ตัวเลือกสินค้า และนำเข้า CSV','SKUs, barcodes, variants and CSV import']},
 {ic:'warehouse',t:['สต็อกและคลัง','Inventory'],d:['สต็อกหลายคลัง โอนย้าย และแจ้งเตือนสินค้าใกล้หมด','Multi-warehouse stock, transfers and low-stock alerts']},
 {ic:'cart',t:['ขายหน้าร้าน','Point of sale'],d:['เงินสด พร้อมเพย์ บัตร และการคืนสินค้า','Cash, PromptPay, card and returns']},
 {ic:'file',t:['ใบแจ้งหนี้','Invoices'],d:['ใบกำกับภาษี PDF เลขที่ต่อเนื่อง และแจ้งเตือนค้างชำระ','PDF tax invoices, numbering and overdue reminders']},
 {ic:'users',t:['ลูกค้า','Customers'],d:['ประวัติการซื้อ ยอดค้างชำระ และกลุ่มลูกค้า','Purchase history, balances and groups']},
 {ic:'chart',t:['รายงาน','Reports'],d:['ยอดขาย กำไร และเปรียบเทียบสาขา','Revenue, profit and branch comparison']},
];
const cats = {coffee:['เมล็ดกาแฟ','Coffee beans'],drinks:['เครื่องดื่ม','Drinks'],bakery:['เบเกอรี่','Bakery'],goods:['ของฝาก','Goods']};
const products = [
 {sku:'BS-001',n:['กาแฟคั่วกลาง ดอยช้าง 250g','Doi Chang Medium Roast 250g'],cat:'coffee',price:320,cost:180,stock:42,ro:15,sold:184},
 {sku:'BS-002',n:['กาแฟคั่วเข้ม 250g','Dark Roast 250g'],cat:'coffee',price:320,cost:175,stock:8,ro:15,sold:121},
 {sku:'BS-010',n:['ลาเต้เย็น','Iced Latte'],cat:'drinks',price:75,cost:22,stock:null,ro:0,sold:612},
 {sku:'BS-011',n:['อเมริกาโน่','Americano'],cat:'drinks',price:60,cost:15,stock:null,ro:0,sold:438},
 {sku:'BS-012',n:['ชาไทยเย็น','Thai Iced Tea'],cat:'drinks',price:65,cost:18,stock:null,ro:0,sold:402},
 {sku:'BS-013',n:['มัทฉะลาเต้','Matcha Latte'],cat:'drinks',price:85,cost:30,stock:null,ro:0,sold:276},
 {sku:'BS-020',n:['ครัวซองต์เนยสด','Butter Croissant'],cat:'bakery',price:65,cost:24,stock:18,ro:10,sold:341},
 {sku:'BS-021',n:['บานอฟฟี่พาย','Banoffee Pie'],cat:'bakery',price:95,cost:38,stock:6,ro:8,sold:158},
 {sku:'BS-030',n:['น้ำผึ้งดอกลำไย 500g','Longan Honey 500g'],cat:'goods',price:240,cost:140,stock:26,ro:10,sold:64},
 {sku:'BS-031',n:['มะม่วงอบแห้ง 200g','Dried Mango 200g'],cat:'goods',price:120,cost:62,stock:3,ro:12,sold:97},
 {sku:'BS-032',n:['แก้วเซรามิกลายคราม','Blue Ceramic Mug'],cat:'goods',price:390,cost:160,stock:14,ro:5,sold:22},
 {sku:'BS-033',n:['ถุงผ้าบ้านสวน','Baan Suan Tote'],cat:'goods',price:250,cost:90,stock:0,ro:5,sold:31},
];
const customers = [
 {n:'บริษัท กรีนลีฟ ออฟฟิศ จำกัด',g:'wholesale',spend:284600,bal:18450,orders:38,last:'2026-10-22',since:'2024-03-11',phone:'02-261-4400',email:'purchasing@greenleaf.co.th'},
 {n:'ร้านขนมหวานใจ',g:'wholesale',spend:96320,bal:11120,orders:52,last:'2026-10-20',since:'2024-08-02',phone:'081-442-7781',email:'wanjai.shop@gmail.com'},
 {n:'Siam Co-working',g:'wholesale',spend:58400,bal:9600,orders:9,last:'2026-10-03',since:'2025-06-19',phone:'02-118-9020',email:'ops@siamcowork.com'},
 {n:'พิมพ์ชนก ศรีสุข',g:'vip',spend:24860,bal:0,orders:141,last:'2026-10-24',since:'2023-11-05',phone:'089-210-5532',email:'pimchanok.s@gmail.com'},
 {n:'Sarah Mitchell',g:'vip',spend:18240,bal:0,orders:96,last:'2026-10-23',since:'2024-01-14',phone:'065-998-1204',email:'sarah.m@outlook.com'},
 {n:'ธนพล วงศ์ใหญ่',g:'general',spend:6420,bal:0,orders:31,last:'2026-10-15',since:'2025-02-27',phone:'092-554-0198',email:'thanapon.w@hotmail.com'},
 {n:'Kenji Tanaka',g:'general',spend:3980,bal:0,orders:12,last:'2026-10-24',since:'2026-04-08',phone:'061-337-2280',email:'kenji.t@gmail.com'},
 {n:'อรุณี แก้วมณี',g:'general',spend:2150,bal:0,orders:14,last:'2026-09-30',since:'2026-01-20',phone:'086-771-3045',email:'arunee.k@gmail.com'},
];
const groups = {vip:['VIP','VIP'],wholesale:['ขายส่ง','Wholesale'],general:['ทั่วไป','General']};
const catering = ['บริการจัดเลี้ยงกาแฟ','Coffee catering service'];
const invoices = [
 {no:'INV-2026-0149',c:6,iss:'2026-10-24',due:'2026-11-07',st:'draft',lines:[['BS-032',3],['BS-033',2],['BS-030',3]]},
 {no:'INV-2026-0148',c:0,iss:'2026-10-22',due:'2026-11-21',st:'sent',lines:[['BS-001',30],['BS-030',20],['cat',1,4050]]},
 {no:'INV-2026-0147',c:1,iss:'2026-10-20',due:'2026-11-04',st:'sent',lines:[['BS-020',48],['BS-021',24],['BS-031',7]]},
 {no:'INV-2026-0146',c:5,iss:'2026-10-15',due:'2026-10-15',st:'paid',lines:[['BS-032',2],['BS-033',2]]},
 {no:'INV-2026-0145',c:2,iss:'2026-10-03',due:'2026-10-18',st:'overdue',lines:[['BS-001',15],['BS-002',15]]},
 {no:'INV-2026-0144',c:0,iss:'2026-09-22',due:'2026-10-22',st:'paid',lines:[['BS-001',25],['BS-030',20],['cat',1,4100]]},
 {no:'INV-2026-0143',c:1,iss:'2026-09-28',due:'2026-10-13',st:'overdue',lines:[['BS-020',40],['BS-021',24]]},
];
const sales = [
 {no:'S-10488',time:'10:41',items:3,total:215,m:'promptpay',who:'สุดารัตน์'},
 {no:'S-10487',time:'10:36',items:1,total:75,m:'cash',who:'สุดารัตน์'},
 {no:'S-10486',time:'10:22',items:4,total:640,m:'card',who:'ภาคิน'},
 {no:'S-10485',time:'10:09',items:2,total:140,m:'promptpay',who:'สุดารัตน์'},
 {no:'S-10484',time:'09:58',items:2,total:150,m:'cash',who:'ภาคิน'},
 {no:'S-10483',time:'09:41',items:5,total:885,m:'promptpay',who:'ภาคิน'},
];
const moves = [
 {d:'2026-10-24 10:41',sku:'BS-031',t:'sale',q:-1,ref:'S-10488',by:'สุดารัตน์',wh:0},
 {d:'2026-10-24 09:15',sku:'BS-020',t:'receive',q:24,ref:'PO-0061',by:'ภาคิน',wh:0},
 {d:'2026-10-23 17:30',sku:'BS-002',t:'transfer',q:-10,ref:'TR-0018',by:'ภาคิน',wh:0},
 {d:'2026-10-23 17:30',sku:'BS-002',t:'transfer',q:10,ref:'TR-0018',by:'Tom',wh:1},
 {d:'2026-10-23 16:02',sku:'BS-021',t:'adjust',q:-2,ref:['ชำรุด','Damaged'],by:'สุดารัตน์',wh:0},
 {d:'2026-10-22 11:20',sku:'BS-001',t:'sale',q:-30,ref:'INV-2026-0148',by:'นิดา',wh:0},
];
const moveTypes = {sale:['ขาย','Sale'],receive:['รับเข้า','Received'],transfer:['โอนย้าย','Transfer'],adjust:['ปรับปรุง','Adjustment']};
const pos = [
 {no:'PO-0063',sup:'ไร่กาแฟดอยช้าง',exp:'2026-10-28',total:21000,st:'ordered'},
 {no:'PO-0062',sup:'สหกรณ์ผึ้งลำพูน',exp:'2026-10-26',total:8400,st:'partial'},
 {no:'PO-0061',sup:'Bake House Supply',exp:'2026-10-24',total:5760,st:'received'},
];
const poSt = {ordered:['สั่งแล้ว','Ordered'],partial:['รับบางส่วน','Partially received'],received:['รับครบ','Received']};
const warehouses = [['คลังสุขุมวิท 49','Sukhumvit 49 store'],['คลังเชียงใหม่ นิมมาน','Chiang Mai Nimman store']];
const branches = [
 {n:['สุขุมวิท 49','Sukhumvit 49'],addr:['49/12 ซ.สุขุมวิท 49 คลองตันเหนือ วัฒนา กรุงเทพฯ 10110','49/12 Sukhumvit 49, Khlong Tan Nuea, Watthana, Bangkok 10110'],staff:4,rev:118640,orders:942},
 {n:['เชียงใหม่ นิมมาน','Chiang Mai Nimman'],addr:['8 ซ.นิมมานเหมินท์ 9 สุเทพ เมือง เชียงใหม่ 50200','8 Nimmanhaemin Soi 9, Suthep, Mueang, Chiang Mai 50200'],staff:2,rev:67780,orders:540},
];
const staff = [
 {n:'นิดา วัฒนกุล',e:'nida@baansuan.co',r:'owner',b:0,st:'active',la:['ตอนนี้','Now']},
 {n:'ภาคิน ทองดี',e:'pakin@baansuan.co',r:'manager',b:0,st:'active',la:['12 นาทีที่แล้ว','12 min ago']},
 {n:'สุดารัตน์ มีสุข',e:'sudarat@baansuan.co',r:'employee',b:0,st:'active',la:['ตอนนี้','Now']},
 {n:'Tom Becker',e:'tom@baansuan.co',r:'manager',b:1,st:'active',la:['เมื่อวาน','Yesterday']},
 {n:'ปวีณา ใจดี',e:'paweena.acc@gmail.com',r:'viewer',b:-1,st:'active',la:['3 วันที่แล้ว','3 days ago']},
 {n:'ณัฐวุฒิ แสงทอง',e:'nattawut.s@gmail.com',r:'employee',b:1,st:'invited',la:['—','—']},
];
const roles = {owner:['เจ้าของ','Owner'],admin:['ผู้ดูแล','Admin'],manager:['ผู้จัดการ','Manager'],employee:['พนักงาน','Employee'],viewer:['ผู้ดูข้อมูล','Viewer']};
const plans = [
 {id:'free',name:'Free',price:0,f:[['ผู้ใช้ 1 คน','1 user'],['สินค้า 50 รายการ','50 products'],['ขายหน้าร้านพื้นฐาน','Basic point of sale']]},
 {id:'starter',name:'Starter',price:199,f:[['ผู้ใช้ 3 คน','3 users'],['สินค้า 500 รายการ','500 products'],['การขายและใบแจ้งหนี้','Sales and invoices'],['ฐานข้อมูลลูกค้า','Customer CRM']]},
 {id:'pro',name:'Pro',price:499,f:[['ผู้ใช้ 10 คน','10 users'],['สินค้า 5,000 รายการ','5,000 products'],['หลายสาขาและหลายคลัง','Multiple branches & warehouses'],['รายงานขั้นสูง','Advanced reports']]},
 {id:'business',name:'Business',price:999,f:[['กำหนดขีดจำกัดได้','Configurable higher limits'],['สาขาไม่จำกัด','Unlimited branches'],['ส่งออกข้อมูลไม่จำกัด','Unlimited exports'],['ซัพพอร์ตแบบเร่งด่วน','Priority support']]},
];
const compareRows = [
 {l:['ผู้ใช้','Users'],v:['1','3','10',['กำหนดได้','Custom']]},
 {l:['สินค้า','Products'],v:['50','500','5,000',['กำหนดได้','Custom']]},
 {l:['สาขา','Branches'],v:['1','1','3',['ไม่จำกัด','Unlimited']]},
 {l:['ใบแจ้งหนี้ PDF','PDF invoices'],v:['—','✓','✓','✓']},
 {l:['รายงานขั้นสูง','Advanced reports'],v:['—','—','✓','✓']},
 {l:['ส่งออก CSV / PDF','CSV / PDF export'],v:[['5 ครั้ง/เดือน','5 / mo'],['50 ครั้ง/เดือน','50 / mo'],['ไม่จำกัด','Unlimited'],['ไม่จำกัด','Unlimited']]},
 {l:['ซัพพอร์ต','Support'],v:[['อีเมล','Email'],['อีเมล','Email'],['อีเมล + แชท','Email + chat'],['เร่งด่วน','Priority']]},
];
const notifs = [
 {t:['มะม่วงอบแห้ง 200g เหลือ 3 ชิ้น','Dried Mango 200g: 3 left'],s:['ต่ำกว่าจุดสั่งซื้อ (12)','Below reorder point (12)'],w:['8 นาที','8 min'],k:'warn'},
 {t:['INV-2026-0145 เกินกำหนด 6 วัน','INV-2026-0145 is 6 days overdue'],s:['Siam Co-working · ฿9,600','Siam Co-working · ฿9,600'],w:['1 ชม.','1 h'],k:'danger'},
 {t:['ณัฐวุฒิ ยังไม่ตอบรับคำเชิญ','Nattawut hasn’t accepted the invite'],s:['ส่งเมื่อ 2 วันที่แล้ว','Sent 2 days ago'],w:['3 ชม.','3 h'],k:'info'},
 {t:['ต่ออายุแพ็กเกจ Pro วันที่ 1 พ.ย.','Pro plan renews Nov 1'],s:['฿499 ผ่านพร้อมเพย์','฿499 via PromptPay'],w:['เมื่อวาน','Yesterday'],k:'info'},
 {t:['บำรุงรักษาระบบ 27 ต.ค. 02:00–03:00','Maintenance Oct 27, 02:00–03:00'],s:['ประกาศจากระบบ','System announcement'],w:['2 วัน','2 d'],k:'info'},
];
const orgs = [
 {n:'บ้านสวน คาเฟ่',id:'org_7f3k2',o:'nida@baansuan.co',p:'Pro',u:6,st:'active',mrr:499,c:'2025-02-14'},
 {n:'Siam Bike Rental',id:'org_2m9qa',o:'admin@siambike.co',p:'Business',u:18,st:'active',mrr:999,c:'2024-11-03'},
 {n:'ร้านยาสุขภาพดี',id:'org_8d1xv',o:'sukkapap.rx@gmail.com',p:'Starter',u:3,st:'active',mrr:199,c:'2025-07-21'},
 {n:'Lanna Craft Studio',id:'org_4c7te',o:'hello@lannacraft.com',p:'Pro',u:4,st:'trial',mrr:0,c:'2026-10-17'},
 {n:'ช่างแอร์เย็นฉ่ำ',id:'org_6b0rp',o:'yenchum.air@gmail.com',p:'Starter',u:2,st:'pastDue',mrr:199,c:'2025-12-09'},
 {n:'Phuket Dive Gear',id:'org_1h5wn',o:'shop@phuketdive.co',p:'Pro',u:7,st:'active',mrr:499,c:'2025-04-30'},
 {n:'ครัวคุณยาย',id:'org_9s2ld',o:'kruakhunyai@gmail.com',p:'Free',u:1,st:'active',mrr:0,c:'2026-08-12'},
 {n:'ร้านดอกไม้ปากคลอง',id:'org_3j8ek',o:'pakkhlong.flower@gmail.com',p:'Starter',u:2,st:'suspended',mrr:0,c:'2025-09-05'},
];
const health = [
 {n:'strata-softwareservice.service',d:['Next.js · ตอบสนอง 84 ms','Next.js · 84 ms response'],ok:true},
 {n:'PostgreSQL 16',d:['การเชื่อมต่อ 18/100','18 of 100 connections'],ok:true},
 {n:'strata-worker.service',d:['งานล้มเหลว 3 รายการใน 24 ชม.','3 failed jobs in 24 h'],ok:false},
 {n:['สำรองข้อมูล','Backups'],d:['สำเร็จล่าสุด 03:00 · ตรวจสอบแล้ว','Last success 03:00 · verified'],ok:true},
 {n:['ใบรับรอง TLS','TLS certificate'],d:['หมดอายุใน 61 วัน','Expires in 61 days'],ok:true},
 {n:['พื้นที่ดิสก์','Disk'],d:['ใช้ไป 42% จาก 160 GB','42% of 160 GB used'],ok:true},
];
const events = [
 {t:['ชำระเงินสำเร็จ','Payment succeeded'],o:'Phuket Dive Gear',a:'฿499',w:'10:31',k:'ok'},
 {t:['ชำระเงินไม่สำเร็จ','Payment failed'],o:'ช่างแอร์เย็นฉ่ำ',a:'฿199',w:'09:12',k:'danger'},
 {t:['Webhook ซ้ำ ถูกข้าม','Duplicate webhook ignored'],o:'Phuket Dive Gear',a:'—',w:'10:31',k:'neutral'},
 {t:['อัปเกรดแพ็กเกจ','Plan upgraded'],o:'Siam Bike Rental',a:'Pro → Business',w:'08:47',k:'ok'},
 {t:['เริ่มทดลองใช้','Trial started'],o:'Lanna Craft Studio',a:'Pro',w:['เมื่อวาน','Yesterday'],k:'neutral'},
];
const sessions = [
 {d:'MacBook Air · Chrome',l:['กรุงเทพฯ','Bangkok'],w:['อุปกรณ์นี้','This device'],cur:true},
 {d:'iPad · Safari (POS)',l:['กรุงเทพฯ','Bangkok'],w:['5 นาทีที่แล้ว','5 min ago']},
 {d:'iPhone 15 · Safari',l:['เชียงใหม่','Chiang Mai'],w:['2 วันที่แล้ว','2 days ago']},
];
const bizTypes = [['ร้านค้าปลีก','Retail'],['ร้านอาหาร / คาเฟ่','Restaurant / café'],['ขายออนไลน์','Online seller'],['ธุรกิจบริการ','Services'],['อื่น ๆ','Other']];
const steps = [['ข้อมูลธุรกิจ','Business'],['สาขาแรก','First branch'],['แพ็กเกจ','Plan'],['พร้อมใช้งาน','Ready']];
return {T,modules,cats,products,customers,groups,catering,invoices,sales,moves,moveTypes,pos,poSt,warehouses,branches,staff,roles,plans,compareRows,notifs,orgs,health,events,sessions,bizTypes,steps};
})();
