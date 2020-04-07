
const AR = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBB26qAvLSUcanXTqmv9oGk_zxwEuaIPzw&language=ar&region=EG&libraries=places,map';
const EN = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBB26qAvLSUcanXTqmv9oGk_zxwEuaIPzw&libraries=places,map';

var lan = localStorage.getItem('user-language') || (navigator.languages && navigator.languages[0].split('-')[0]) || navigator.language.split('-')[0];

  if(lan==="en"){
     document.write("<script src="+EN+"></script>");
  }
  if(lan==="ar"){
     document.write("<script src="+AR+"></script>");
  }
