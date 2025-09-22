document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const dropZone = document.getElementById('dropZone');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const formatSelect = document.getElementById('formatSelect');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    const processBtn = document.getElementById('processBtn');
    const resultSection = document.getElementById('resultSection');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const newImageBtn = document.getElementById('newImageBtn');
    const fileSize = document.getElementById('fileSize');
    const fileFormat = document.getElementById('fileFormat');
    
    let originalImage = null;
    let processedImage = null;
    
    // آپلود با کلیک
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // آپلود با انتخاب فایل
    fileInput.addEventListener('change', handleFileSelect);
    
    // آپلود با درگ و دراپ
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2ecc71';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3498db';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    
    // مدیریت فایل آپلود شده
    function handleFileSelect() {
        const file = fileInput.files[0];
        
        if (!file || !file.type.match('image.*')) {
            alert('لطفاً یک فایل تصویری معتبر انتخاب کنید');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            originalImage = e.target.result;
            previewImage.src = originalImage;
            previewSection.style.display = 'block';
            resultSection.style.display = 'none';
            
            // تنظیم مقدار پیش‌فرض
            qualitySlider.value = 80;
            qualityValue.textContent = '80%';
            sizeSlider.value = 500;
            sizeValue.textContent = '500 KB';
        };
        
        reader.readAsDataURL(file);
    }
    
    // تغییر کیفیت
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });
    
    // تغییر حجم
    sizeSlider.addEventListener('input', function() {
        sizeValue.textContent = this.value + ' KB';
    });
    
    // پردازش و دانلود
    processBtn.addEventListener('click', function() {
        if (!originalImage) {
            alert('لطفاً ابتدا یک تصویر آپلود کنید');
            return;
        }
        
        const quality = parseInt(qualitySlider.value) / 100;
        const format = formatSelect.value;
        
        // ایجاد Canvas برای پردازش تصویر
        const img = new Image();
        img.src = originalImage;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // تنظیم اندازه Canvas
            canvas.width = img.width;
            canvas.height = img.height;
            
            // کشیدن تصویر روی Canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // تبدیل تصویر به Blob با کیفیت مورد نظر
            canvas.toBlob(function(blob) {
                processedImage = blob;
                
                // نمایش تصویر پردازش شده
                const url = URL.createObjectURL(blob);
                resultImage.src = url;
                
                // نمایش بخش نتیجه
                resultSection.style.display = 'block';
                
                // محاسبه حجم فایل
                const sizeInKB = (blob.size / 1024).toFixed(2);
                fileSize.textContent = sizeInKB + ' KB';
                fileFormat.textContent = format.toUpperCase();
                
                // تنظیم متن دکمه دانلود
                downloadBtn.textContent = 'دانلود ' + format.toUpperCase();
            }, format, quality);
        };
    });
    
    // دانلود تصویر
    downloadBtn.addEventListener('click', function() {
        if (!processedImage) return;
        
        const url = URL.createObjectURL(processedImage);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image.${formatSelect.value}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // شروع پردازش جدید
    newImageBtn.addEventListener('click', function() {
        originalImage = null;
        processedImage = null;
        previewImage.src = '';
        resultImage.src = '';
        fileInput.value = '';
        previewSection.style.display = 'none';
        resultSection.style.display = 'none';
    });
});