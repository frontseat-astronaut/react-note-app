function getCurrentTime(){
    const zp = (num, cnt) => String(num).padStart(cnt, "0");
    let today = new Date();
    let date = zp(today.getFullYear(), 4)+zp(today.getMonth()+1, 2)+zp(today.getDate(), 2);
    let time = zp(today.getHours(), 2) + zp(today.getMinutes(), 2) + zp(today.getSeconds(), 2);
    let dateTime = date+time;
    return dateTime;
}

export default getCurrentTime;
