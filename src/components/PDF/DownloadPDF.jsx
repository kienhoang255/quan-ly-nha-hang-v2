import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadPDF = async () => {
  const data = document.getElementById("canvas");

  var doc = new jsPDF("p", "mm", "a4");

  await html2canvas(data, {
    logging: true,
    letterRendering: 1,
    useCORS: true,
  }).then((res) => {
    const imgWidth = 208;
    doc.addImage(res.toDataURL("image/png"), "PNG", 0, 0, imgWidth, 300);
  });

  doc.save("hoadon.pdf");
};
export default DownloadPDF;
