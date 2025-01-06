const Ziggy = {"url":"http:\/\/pos-app.test","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"home":{"uri":"\/","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"suppliers.index":{"uri":"suppliers","methods":["GET","HEAD"]},"suppliers.create":{"uri":"suppliers\/create","methods":["GET","HEAD"]},"suppliers.store":{"uri":"suppliers","methods":["POST"]},"suppliers.show":{"uri":"suppliers\/{supplier}","methods":["GET","HEAD"],"parameters":["supplier"],"bindings":{"supplier":"id"}},"suppliers.edit":{"uri":"suppliers\/{supplier}\/edit","methods":["GET","HEAD"],"parameters":["supplier"],"bindings":{"supplier":"id"}},"suppliers.update":{"uri":"suppliers\/{supplier}","methods":["PUT","PATCH"],"parameters":["supplier"],"bindings":{"supplier":"id"}},"suppliers.destroy":{"uri":"suppliers\/{supplier}","methods":["DELETE"],"parameters":["supplier"],"bindings":{"supplier":"id"}},"members.reset-voucher":{"uri":"members\/reset-voucher","methods":["PUT"]},"members.update-voucher":{"uri":"members\/update-voucher\/{member}","methods":["PUT"],"parameters":["member"],"bindings":{"member":"id"}},"members.index":{"uri":"members","methods":["GET","HEAD"]},"members.create":{"uri":"members\/create","methods":["GET","HEAD"]},"members.store":{"uri":"members","methods":["POST"]},"members.show":{"uri":"members\/{member}","methods":["GET","HEAD"],"parameters":["member"],"bindings":{"member":"id"}},"members.edit":{"uri":"members\/{member}\/edit","methods":["GET","HEAD"],"parameters":["member"],"bindings":{"member":"id"}},"members.update":{"uri":"members\/{member}","methods":["PUT","PATCH"],"parameters":["member"],"bindings":{"member":"id"}},"members.destroy":{"uri":"members\/{member}","methods":["DELETE"],"parameters":["member"],"bindings":{"member":"id"}},"categories.index":{"uri":"categories","methods":["GET","HEAD"]},"categories.create":{"uri":"categories\/create","methods":["GET","HEAD"]},"categories.store":{"uri":"categories","methods":["POST"]},"categories.show":{"uri":"categories\/{category}","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.edit":{"uri":"categories\/{category}\/edit","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.update":{"uri":"categories\/{category}","methods":["PUT","PATCH"],"parameters":["category"],"bindings":{"category":"id"}},"categories.destroy":{"uri":"categories\/{category}","methods":["DELETE"],"parameters":["category"],"bindings":{"category":"id"}},"products.index":{"uri":"products","methods":["GET","HEAD"]},"products.create":{"uri":"products\/create","methods":["GET","HEAD"]},"products.store":{"uri":"products","methods":["POST"]},"products.show":{"uri":"products\/{product}","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.edit":{"uri":"products\/{product}\/edit","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.update":{"uri":"products\/{product}","methods":["PUT","PATCH"],"parameters":["product"],"bindings":{"product":"id"}},"products.destroy":{"uri":"products\/{product}","methods":["DELETE"],"parameters":["product"],"bindings":{"product":"id"}},"purchases.index":{"uri":"purchases","methods":["GET","HEAD"]},"purchases.create":{"uri":"purchases\/create","methods":["GET","HEAD"]},"purchases.store":{"uri":"purchases","methods":["POST"]},"purchases.show":{"uri":"purchases\/{purchase}","methods":["GET","HEAD"],"parameters":["purchase"],"bindings":{"purchase":"id"}},"purchases.edit":{"uri":"purchases\/{purchase}\/edit","methods":["GET","HEAD"],"parameters":["purchase"],"bindings":{"purchase":"id"}},"purchases.update":{"uri":"purchases\/{purchase}","methods":["PUT","PATCH"],"parameters":["purchase"],"bindings":{"purchase":"id"}},"purchases.destroy":{"uri":"purchases\/{purchase}","methods":["DELETE"],"parameters":["purchase"],"bindings":{"purchase":"id"}},"purchase-details.index":{"uri":"purchase-details","methods":["GET","HEAD"]},"purchase-details.create":{"uri":"purchase-details\/create","methods":["GET","HEAD"]},"purchase-details.store":{"uri":"purchase-details","methods":["POST"]},"purchase-details.show":{"uri":"purchase-details\/{purchase_detail}","methods":["GET","HEAD"],"parameters":["purchase_detail"]},"purchase-details.edit":{"uri":"purchase-details\/{purchase_detail}\/edit","methods":["GET","HEAD"],"parameters":["purchase_detail"]},"purchase-details.update":{"uri":"purchase-details\/{purchase_detail}","methods":["PUT","PATCH"],"parameters":["purchase_detail"]},"purchase-details.destroy":{"uri":"purchase-details\/{purchase_detail}","methods":["DELETE"],"parameters":["purchase_detail"]},"sales.index":{"uri":"sales","methods":["GET","HEAD"]},"sales.create":{"uri":"sales\/create","methods":["GET","HEAD"]},"sales.store":{"uri":"sales","methods":["POST"]},"sales.show":{"uri":"sales\/{sale}","methods":["GET","HEAD"],"parameters":["sale"],"bindings":{"sale":"id"}},"sales.edit":{"uri":"sales\/{sale}\/edit","methods":["GET","HEAD"],"parameters":["sale"],"bindings":{"sale":"id"}},"sales.update":{"uri":"sales\/{sale}","methods":["PUT","PATCH"],"parameters":["sale"],"bindings":{"sale":"id"}},"sales.destroy":{"uri":"sales\/{sale}","methods":["DELETE"],"parameters":["sale"],"bindings":{"sale":"id"}},"sale-details.index":{"uri":"sale-details","methods":["GET","HEAD"]},"sale-details.create":{"uri":"sale-details\/create","methods":["GET","HEAD"]},"sale-details.store":{"uri":"sale-details","methods":["POST"]},"sale-details.show":{"uri":"sale-details\/{sale_detail}","methods":["GET","HEAD"],"parameters":["sale_detail"]},"sale-details.edit":{"uri":"sale-details\/{sale_detail}\/edit","methods":["GET","HEAD"],"parameters":["sale_detail"]},"sale-details.update":{"uri":"sale-details\/{sale_detail}","methods":["PUT","PATCH"],"parameters":["sale_detail"]},"sale-details.destroy":{"uri":"sale-details\/{sale_detail}","methods":["DELETE"],"parameters":["sale_detail"]},"sales.cashless":{"uri":"sales\/{sale}\/cashless","methods":["PUT"],"parameters":["sale"],"bindings":{"sale":"id"}},"timeline":{"uri":"timeline","methods":["GET","HEAD"]},"sample":{"uri":"sample","methods":["GET","HEAD"]},"members.all":{"uri":"all-members","methods":["GET","HEAD"]},"products.all":{"uri":"all-products","methods":["GET","HEAD"]},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify-email","methods":["GET","HEAD"]},"verification.verify":{"uri":"verify-email\/{id}\/{hash}","methods":["GET","HEAD"],"parameters":["id","hash"]},"verification.send":{"uri":"email\/verification-notification","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"profile":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
