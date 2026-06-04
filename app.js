
const target = new Date('2027-08-08T13:00:00');
setInterval(()=>{
 const diff=Math.max(0,target-new Date());
 const d=Math.floor(diff/86400000);
 document.getElementById('timer').innerText=d+' дней';
},1000);
