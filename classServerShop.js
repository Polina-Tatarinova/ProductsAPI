export class ServerShop {
  static BASE_URL = "http://localhost:3000";
  constructor() {
    //вот тут конечно вопрос нужен ли он, хотя тоже что сюда писать
  }
  static async getProduct(){
    return fetch(this.BASE_URL + `/product`).then((res) => {
        if(!res.ok){
                throw "Не удалось получить товары";
        }
    return res.json()});
  }

  static async buyProduct(id){
    return fetch(this.BASE_URL + `/product/${id}/purchase`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Partially Updated Title',
  }),
})
.then((res)=>{
if(!res.ok){
    throw "Не удалось купить";
}
return res.json()})
}

static async administratorRights(){
    return fetch(this.BASE_URL + `/adminPanel`).then((res) => {
        if(!res.ok){
                throw "Не удалось получить доступ к правам администратора";
        }
    return res.json()});
}

static async productModification(id){
    return fetch(this.BASE_URL + `/product/${id}`, 
        { method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify() })
  .then((response) =>{
    if(!response.ok){
            throw "Не удалось изменить товар";
    }
  return response.json()} )
}

static async deletingProduct(id){
    return fetch(this.BASE_URL + `/product/${id}`,{ method: 'DELETE' }).then((res)=>{
    if(!res.ok){
            throw "Не удалось удалить товар";
    }
  return res.json()})
}

static async creatingNewProduct(){
    return fetch(this.BASE_URL + `/product`,{ method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newProduct)}).then((res)=>{
    if(!res.ok){
            throw "Не удалось создать товар";
    }
  return res.json()})
}

}