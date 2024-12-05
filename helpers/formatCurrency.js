function formatCurrency(num){
 return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
}


module.exports = formatCurrency;