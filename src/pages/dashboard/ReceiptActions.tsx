// import React, { useRef } from 'react';
// // import domtoimage from 'dom-to-image-more';
// import * as domtoimage from 'dom-to-image-more';
// import { jsPDF } from 'jspdf';
// import { Button } from "@/components/ui/button";
// import { ExportCurve, DirectInbox } from "iconsax-react";

// interface TransactionData {
//   id: string;
//   amount: string;
//   currency: string;
//   recipientName: string;
//   bankCode: string;
//   accountNumber: string;
//   date: string;
//   time: string;
// }

// interface ReceiptActionsProps {
//   transactionData: TransactionData;
// }

// const ReceiptActions: React.FC<ReceiptActionsProps> = ({ transactionData }) => {
//   const receiptRef = useRef<HTMLDivElement>(null);

//   const generatePDFBlob = async (): Promise<Blob | null> => {
//     if (!receiptRef.current) return null;

//     try {
//       // dom-to-image-more handles oklch perfectly by using SVG foreignObject
//       const dataUrl = await domtoimage.toPng(receiptRef.current, {
//         width: 450,
//         height: 800,
//         style: {
//           transform: 'scale(1)',
//           left: 0,
//           top: 0,
//         }
//       });

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'px',
//         format: [450, 800]
//       });

//       pdf.addImage(dataUrl, 'PNG', 0, 0, 450, 800);
//       return pdf.output('blob');
//     } catch (err) {
//       console.error("Receipt Generation Error:", err);
//       return null;
//     }
//   };

//   const handleDownload = async () => {
//     const blob = await generatePDFBlob();
//     if (blob) {
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `Receipt-${transactionData.id}.pdf`;
//       link.click();
//       URL.revokeObjectURL(url);
//     }
//   };

//   const handleShare = async () => {
//     const blob = await generatePDFBlob();
//     if (!blob) return;
//     const file = new File([blob], `Receipt-${transactionData.id}.pdf`, { type: 'application/pdf' });
    
//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       try {
//         await navigator.share({
//           files: [file],
//           title: 'Transaction Receipt',
//           text: `Receipt for ${transactionData.currency} ${transactionData.amount}`,
//         });
//       } catch (error) {
//         if ((error as Error).name !== 'AbortError') handleDownload();
//       }
//     } else {
//       handleDownload();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full gap-4">
//       <div className="flex gap-4 w-full justify-center absolute bottom-10 z-50">
//         <Button 
//           onClick={handleDownload} 
//           variant="outline" 
//           className="flex-1 max-w-[160px] rounded-full gap-2 border-gray-200 bg-white text-black h-12"
//         >
//           <DirectInbox size="18" /> Download
//         </Button>
        
//         <Button 
//           onClick={handleShare} 
//           className="flex-1 max-w-[160px] rounded-full gap-2 bg-[#0647F7] text-white h-12"
//         >
//           <ExportCurve size="18" /> Share
//         </Button>
//       </div>

//       {/* RECEIPT UI: Replicated from image */}
//       <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
//         <div 
//           ref={receiptRef} 
//           className="w-[450px] p-12 bg-white text-center"
//           style={{ fontFamily: 'Inter, Arial, sans-serif', minHeight: '800px' }}
//         >
//           {/* Logo Section */}
//           <div className="flex flex-col items-center mb-10">
//              <div className="flex items-center gap-1 mb-1">
//                 <ExportCurve size="24" variant="Bold" color="#000" />
//                 <h1 className="text-2xl font-black text-black">SendCoins</h1>
//              </div>
//              <p className="text-gray-400 text-sm font-medium">Transaction Receipt</p>
//           </div>

//           {/* Success Badge */}
//           <div className="bg-[#E9F7EF] text-[#27AE60] py-2 px-6 rounded-full inline-flex items-center gap-2 text-sm font-bold mb-10">
//             ✓ Successful
//           </div>

//           {/* Amount Section */}
//           <div className="mb-14">
//             <p className="text-gray-400 text-sm font-medium mb-1">Amount</p>
//             <p className="text-5xl font-black text-black uppercase">
//               {transactionData.currency} {transactionData.amount}
//             </p>
//           </div>

//           <div className="w-full h-[1.5px] bg-gray-100 mb-10" />

//           {/* Transaction Details */}
//           <div className="space-y-6 text-left">
//             <Row label="Transaction ID" value={transactionData.id} />
//             <Row label="Type" value="Sent" />
//             <Row label="Recipient" value={transactionData.recipientName} />
//             <Row label="Bank" value={transactionData.bankCode} />
//             <Row label="Account" value={transactionData.accountNumber} />
//             <Row label="Date" value={transactionData.date} />
//             <Row label="Time" value={transactionData.time} />
//           </div>

//           <div className="w-full h-[1.5px] bg-gray-100 mt-10 mb-10" />
          
//           <p className="text-gray-300 text-sm font-medium">Thank you for using Sendcoins</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Row = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex justify-between items-start">
//     <span className="text-gray-400 text-base font-medium">{label}</span>
//     <span className="text-base font-bold text-right text-gray-900 uppercase max-w-[240px] leading-tight">
//       {value}
//     </span>
//   </div>
// );

// export default ReceiptActions;