let bmi = 0;
let evaluation = "";

function generateNotificationId() {
  return Math.floor(Math.random() * 100000);
}

async function calculateBMI() {
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');

  const heightStr = heightInput.value.trim();
  const weightStr = weightInput.value.trim();

  const height = parseFloat(heightStr);
  const weight = parseFloat(weightStr);

  // Kiểm tra dữ liệu không hợp lệ
  if (
    heightStr === "" || weightStr === "" ||
    isNaN(height) || isNaN(weight) ||
    height <= 0 || weight <= 0
  ) {
    alert("❗ Vui lòng nhập chiều cao và cân nặng hợp lệ!");
    return;
  }

  const heightInMeters = height / 100;
  bmi = (weight / (heightInMeters ** 2)).toFixed(2);

  // Đánh giá kết quả
  if (bmi < 18.5) evaluation = 'Gầy';
  else if (bmi < 24.9) evaluation = 'Bình thường';
  else if (bmi < 29.9) evaluation = 'Thừa cân';
  else evaluation = 'Béo phì';

  const resultText = `BMI: ${bmi} - ${evaluation}`;
  document.getElementById('result').innerText = resultText;

  // Hiển thị thông báo cục bộ (nếu native app)
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    const { LocalNotifications } = Capacitor.Plugins;

    try {
      LocalNotifications.removeAllListeners();

      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        alert(`🔔 ${notification.title}\n${notification.body}`);
      });

      await LocalNotifications.schedule({
        notifications: [{
          title: "Kết quả BMI",
          body: resultText,
          id: generateNotificationId(),
        }],
      });

    } catch (error) {
      console.error("Lỗi thông báo:", error);
      alert(resultText); // fallback
    }

  } else {
    alert(resultText);
  }
}

async function shareResult() {
  if (!bmi) {
    alert("Hãy tính BMI trước khi chia sẻ!");
    return;
  }

  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      const Share = Capacitor.Plugins.Share;
      await Share.share({
        title: "Kết quả BMI",
        text: `Chỉ số BMI của tôi là ${bmi} - ${evaluation}.`,
        dialogTitle: "Chia sẻ với...",
      });
    } catch (error) {
      console.error("Lỗi chia sẻ:", error);
    }
  } else {
    alert(`Chỉ số BMI của bạn là ${bmi} - ${evaluation}.`);
  }
}

async function takePhoto() {
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      const { Camera } = Capacitor.Plugins;

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'dataUrl',
      });

      const photoElement = document.getElementById('photo');
      photoElement.src = image.dataUrl;
      photoElement.style.display = 'block';

    } catch (error) {
      console.error("Lỗi chụp ảnh:", error);
      alert("Không thể chụp ảnh. Kiểm tra quyền truy cập camera.");
    }
  } else {
    alert("Chức năng chụp ảnh chỉ khả dụng trong ứng dụng.");
  }
}

window.calculateBMI = calculateBMI;
window.shareResult = shareResult;
window.takePhoto = takePhoto;
