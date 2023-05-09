import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const btnStart = document.querySelector('button[data-start]');
btnStart.disabled = true;
let timerId = null;

const refs = {
  dayRemain: document.querySelector('[data-days]'),
  hourRemain: document.querySelector('[data-hours]'),
  minuteRemain: document.querySelector('[data-minutes]'),
  secondRemain: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const currentDate = new Date();

    if (selectedDates[0] - currentDate > 0) {
      btnStart.disabled = false;
    } else {
      btnStart.disabled = true;
      Notify.failure('Please choose a date in the future', {
        timeout: 1500,
        width: '400px',
      });
    }
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function onTimerStart() {
  const selectedDate = timePicker.selectedDates[0];
  btnStart.disabled = true;
  timePicker.input.disabled = true;
  timerId = setInterval(() => {
    const startTime = new Date();
    const countdown = selectedDate - startTime;
    if (countdown < 0) {
      clearInterval(timerId);
      return;
    }
    updateTimer(convertMs(countdown));
  }, 1000);
}
function updateTimer({ days, hours, minutes, seconds }) {
  refs.dayRemain.textContent = addLeadingZero(days);
  refs.hourRemain.textContent = addLeadingZero(hours);
  refs.minuteRemain.textContent = addLeadingZero(minutes);
  refs.secondRemain.textContent = addLeadingZero(seconds);
}

const timePicker = flatpickr('#datetime-picker', options);

btnStart.addEventListener('click', onTimerStart);
