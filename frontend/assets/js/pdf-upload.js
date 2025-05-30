class PDFUploader {
  static init() {
    const uploadForm = document.getElementById('pdfUploadForm');
    if (!uploadForm) return;

    uploadForm.addEventListener('submit', this.handleUpload.bind(this));
    document.getElementById('pdfFile').addEventListener('change', this.previewPDF);
  }

  static previewPDF(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const previewContainer = document.getElementById('pdfPreview');
    previewContainer.innerHTML = '';

    const reader = new FileReader();
    reader.onload = function(e) {
      const iframe = document.createElement('iframe');
      iframe.src = e.target.result;
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      previewContainer.appendChild(iframe);
    };
    reader.readAsDataURL(file);
  }

  static async handleUpload(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const transactionId = form.dataset.transactionId;

    try {
      DOM.toggleLoader(true);
      const response = await fetch(`/api/transactions/${transactionId}/verify`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Ошибка загрузки');

      const result = await response.json();
      if (result.valid) {
        NotificationCenter.showNotification({
          title: 'Чек подтверждён',
          message: 'PDF-чек успешно верифицирован',
          type: 'success'
        });
        window.location.reload();
      } else {
        throw new Error(result.message || 'Несоответствие данных чека');
      }
    } catch (error) {
      NotificationCenter.showNotification({
        title: 'Ошибка верификации',
        message: error.message,
        type: 'error'
      });
    } finally {
      DOM.toggleLoader(false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => PDFUploader.init());
