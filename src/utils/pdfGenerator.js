import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../public/logo.png';

export const generateRentStatement = async (tenant, transactions) => {
  const doc = new jsPDF();
  
  // Add logo
  const imgData = logo;
  doc.addImage(imgData, 'PNG', 20, 20, 40, 40);
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(255, 107, 53);
  doc.text('DOMUSONE - Rent Statement', 80, 40);
  
  // Tenant Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${tenant.name}`, 20, 80);
  doc.text(`Room: ${tenant.roomNumber}`, 20, 90);
  doc.text(`Apartment: ${tenant.apartment}`, 20, 100);
  doc.text(`Phone: ${tenant.phoneNumber}`, 20, 110);
  doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, 20, 120);
  
  // Transaction Table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    `KES ${t.amount.toLocaleString()}`,
    t.status
  ]);
  
  doc.autoTable({
    startY: 130,
    head: [['Date', 'Type', 'Amount', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [255, 107, 53] }
  });
  
  // Summary
  const totalPaid = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(255, 107, 53);
  doc.text(`Total Paid: KES ${totalPaid.toLocaleString()}`, 20, finalY);
  doc.text(`Current Balance: KES ${tenant.balance.toLocaleString()}`, 20, finalY + 10);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('DOMUSONE - Professional Property Management', 20, doc.internal.pageSize.height - 20);
  
  doc.save(`rent-statement-${tenant.name}-${Date.now()}.pdf`);
};
