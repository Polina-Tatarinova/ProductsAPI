import ShopService from "./ShopService.js";
import UIRenderer from "./UIRenderer.js";

const ui = new UIRenderer();
ui.render();

// ShopService.getProducts().then(res=>{
//     console.log(res)
// });//работает
// ShopService.buyProduct(2).then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.error(err)
// })//работает
// ShopService.checkAdministratorRights("1235").then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.error(err)
// })
// ShopService.changeProduct(22, {
//   name: "доска",
//   price: 1500,
//   description: "картонная",
//   category: "Товары для дома",
//   stock: 3,
//   imageUrl: "https://example.com/new-image.jpg",
//   rating: 5.0,
// }).then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.error(err)
// });
// ShopService.deleteProduct(3).then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.error(err)
// })
// ShopService.createNewProduct({
//   name: "доска",
//   price: 1500,
//   description: "картонная",
//   category: "Товары для дома",
//   stock: 3,
//   imageUrl: "https://example.com/new-image.jpg",
//   rating: 5.0,
// }).then(res=>{
//     console.log(res)
// }).catch(err=>{
// console.error(err)
// })
// // console.log(ShopServes.deletProduct(1));
// console.log(ShopServes.creatNewProduct());
