

async function generateInvoice() {
 const invoiceData = {
     invoiceNumber: "2021.0002", // Data yang ingin dikirim
     invoiceDate: "06-01-2021",
     products: [
         { quantity: 1, description: "Produk 1", tax: 5, price: 50 },
         { quantity: 2, description: "Produk 2", tax: 10, price: 100 }
     ]
 };

 try {
     const response = await fetch('/create-invoice', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(invoiceData)
     });

     if (response.ok) {
         const blob = await response.blob(); // Mendapatkan hasil sebagai blob
         const url = window.URL.createObjectURL(blob);

         // Membuat link sementara untuk mengunduh file
         const a = document.createElement('a');
         a.href = url;
         a.download = `invoice_${invoiceData.invoiceNumber}.pdf`;
         document.body.appendChild(a);
         a.click();
         a.remove();

         // Membersihkan URL objek
         window.URL.revokeObjectURL(url);
     } else {
         console.error("Failed to generate invoice:", await response.json());
     }
 } catch (error) {
     console.error("Error generating invoice:", error);
 }
}

module.exports = generateInvoice;