import { SHA256 } from 'crypto-js';

export function checkForTokenizationResponse(){
  var search = location.search.substring(1);
  if(search
      && JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}').service_command==='TOKENIZATION') {
    localStorage.setItem('fort_token', JSON.stringify(JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')));
    clearQuerryString();
  } else if(search
      && JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}').command==='PURCHASE') {
    localStorage.setItem('success_purchase', JSON.stringify(JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')));
    clearQuerryString();
  }
}

export function makePurchase(amount, card, email) {
  let requestBody = {
    command: 'PURCHASE',
    access_code: 'Frck0plLzRL5Qp9adJ7u',
    merchant_identifier: 'swfAPnVc',
    merchant_reference: card.merchant_reference,
    amount: amount,
    currency: 'SAR',
    language: 'en',
    customer_email: email,
    token_name: card.pftoken,
    return_url: document.location.origin
  }
  requestBody.signature = generateSignature(requestBody);
  localStorage.removeItem('fort_token');

  return requestBody;
}

export function showPurchaseResults() {
  let result = JSON.parse(localStorage.getItem('success_purchase'));
  localStorage.removeItem('success_purchase');
  if(result.response_message==='Success')
    return {message: result.response_message, level: 'success', fortId: result.fort_id}
  else
    return {message: result.response_message, level: 'error'}
}

export function generateSignature(body) {
        let signature = 'PASS';
        signature += `access_code=${body.access_code}`;
        signature += `amount=${body.amount}`;
        signature += `command=${body.command}`;
        signature += `currency=${body.currency}`;
        signature += `customer_email=${body.customer_email}`;
        signature += `language=${body.language}`;
        signature += `merchant_identifier=${body.merchant_identifier}`;
        signature += `merchant_reference=${body.merchant_reference}`;
        signature += `return_url=${body.return_url}`;
        signature += `token_name=${body.token_name}`;
        signature += 'PASS';
        return SHA256(signature).toString();
    }

function clearQuerryString(){
  var query = window.location.search.substring(1)
  if(query.length) {
     if(window.history != undefined && window.history.pushState != undefined) {
          window.history.pushState({}, document.title, window.location.pathname);
     }
  }
}
