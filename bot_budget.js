var token = "1834670644:AAFJz7Bmr-WhdwCn-DbgBKU0Sa3fCA0lk74"; 
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbyIoFKL5TVSjkehnSqG7_lojGlqRZtBcdbK4iTCw5l6AOPAFoki/exec";


function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function answerCallbackQuery(callback_query_id, text) {
  var data = {
    method: "post",
    payload: {
      method: "answerCallbackQuery",
      callback_query_id: String(callback_query_id),
      text: text,
      show_alert: true,
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

function sendText(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

function flatten(arrayOfArrays) {
  return [].concat.apply([], arrayOfArrays);
}

function findRow_() {
  var ss = SpreadsheetApp.openById("1x3iBtz7HIe23ztV-CnEleTdG0z5N_1KqrNGsOsQbYbA");;
  ss.getSheetByName("Лист1");
  var r = ss.getRange('B:B');
  // Step forwards by hundreds
  for (var i = 2; !r.getCell(i,1).isBlank(); i += 100) { }
  // Step backwards by tens
  for ( ; r.getCell(i,1).isBlank(); i -= 10) { }
  // Step forwards by ones
  for ( ; !r.getCell(i,1).isBlank(); i++) { }
  return i;
}

function isInt(value){ 
    return (parseFloat(value) == parseInt(value)) && !isNaN(value);
}

function doPost(e) {
//parse user data
var contents = JSON.parse(e.postData.contents);
var ss = SpreadsheetApp.openById("1x3iBtz7HIe23ztV-CnEleTdG0z5N_1KqrNGsOsQbYbA");
var expenseSheet =  ss.getSheetByName("Лист1");
  
   //if (contents.callback_query) {
   // var id_callback = contents.callback_query.from.id;
   // var data = contents.callback_query.data;
   
    if (contents.message) {
    var id_message = contents.message.from.id;
    var text = contents.message.text;
    var firstName = contents.message.from.first_name + " " + contents.message.from.last_name;
    var date = new Date();
    const typeRD = new Map();
    typeRD.set('/d_vznos', 'Доходы_Членские взносы');
    typeRD.set('/d_abn', 'Доходы_Абонементы Первый Цикл');
    typeRD.set('/d_publ', 'Доходы_Публичные мероприятия');
    typeRD.set('/d_vznos', 'Доходы_Членские взносы');
    typeRD.set('/d_abn', 'Доходы_Абонементы Первый Цикл');
    typeRD.set('/d_publ', 'Доходы_Публичные мероприятия');
    typeRD.set('/d_bifet', 'Доходы_Буфет');
    typeRD.set('/d_book', 'Доходы_Продажа книг');
    typeRD.set('/d_rehearsal', 'Доходы_Пожертвование');
    typeRD.set('/d_dotac', 'Доходы_Дотация ШФ');
    typeRD.set('/d_renta', 'Доходы_Аренда');
    typeRD.set('/d_other', 'Доходы_Прочее');
    typeRD.set('/r_renta', 'Расходы_Аренда помещения');
    typeRD.set('/r_commun', 'Расходы_Коммунальные услуги');
    typeRD.set('/r_dom', 'Расходы_Расходы на содержание помещения');
    typeRD.set('/r_work', 'Расходы_Расходы на работу секретариатов');
    typeRD.set('/r_ad', 'Расходы_Реклама');
    typeRD.set('/r_ads', 'Расходы_Реклама в Интернете');
    typeRD.set('/r_mebel', 'Расходы_Покупка мебели и техники');
    typeRD.set('/r_fee', 'Расходы_Налоги, банк');
    typeRD.set('/r_remont', 'Расходы_Ремонт помещения');
    typeRD.set('/r_bufet', 'Расходы_Буфет');
    typeRD.set('/r_quotas', 'Расходы_Квоты');
    typeRD.set('/r_other', 'Расходы_Прочее');
    typeRD.set('/r_museon', 'Расходы_Мусейон');
    
    
    if  (typeRD.has(text)){
    var text_print = typeRD.get(text);
    let item = text_print.split("_");
    expenseSheet.appendRow([firstName,date,item[0],item[1]]);
    sendText(id_message,'Класс! А теперь напиши сумму и комментарий в формате "1234 = комментарий" и отправь.');
     
  // } else if (isInt(text)) {
  } else if (text.includes('=')) {  
    let item = text.split("=");
    let n = (findRow_() - 1);
    expenseSheet.getRange(n, 5).setValue(item[0]);
    expenseSheet.getRange(n, 6).setValue(item[1]);
    sendText(id_message, "Спасибо, данные успешно внесены!");
    //answerCallbackQuery (id_message, "СПАСИБО!");
  } else {
   sendText(id_message, "Давай, ещё раз выбери команду 👇 в квадратике с /." );
  }
}
}