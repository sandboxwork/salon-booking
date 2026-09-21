(() => {
  'use strict';
  const recipient = 'sandboxwork@proton.me';
  const form = document.getElementById('booking-form');
  const dateInput = document.getElementById('visit-date');
  const preview = document.getElementById('email-preview');
  const bodyField = document.getElementById('email-body');
  const status = document.getElementById('form-status');
  const koreaToday = () => {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    const get = type => parts.find(part => part.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  };
  dateInput.min = koreaToday();
  dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    dateInput.min = koreaToday();
    const data = new FormData(form);
    const name = String(data.get('guestName')).trim();
    const nameField = document.getElementById('guest-name');
    nameField.setCustomValidity(name ? '' : '예약자 이름을 입력해 주세요.');
    if (!form.reportValidity()) return;
    const date = String(data.get('date'));
    const time = String(data.get('time'));
    const service = String(data.get('service'));
    const email = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    const body = [
      '안녕하세요. 미용실 예약 문의드립니다.', '',
      `예약자 이름: ${name}`, `희망 날짜: ${date}`, `희망 시간: ${time}`,
      `시술 내용: ${service}`, `회신 이메일: ${email}`, '',
      `추가 요청: ${message || '없음'}`, '',
      '위 일정으로 예약 가능한지 확인 부탁드립니다.', '감사합니다.'
    ].join('\n');
    bodyField.value = body;
    const subject = `미용실 예약 문의 — ${date} ${time} / ${name}`;
    document.getElementById('send-email').href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.hidden = true;
    preview.hidden = false;
    status.textContent = '';
    document.getElementById('preview-title').focus();
  });
  document.getElementById('guest-name').addEventListener('input', event => event.target.setCustomValidity(''));
  document.getElementById('edit-email').addEventListener('click', () => {
    preview.hidden = true;
    form.hidden = false;
    status.textContent = '';
    document.getElementById('guest-name').focus();
  });
  document.getElementById('copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bodyField.value);
      status.textContent = '문의 내용을 복사했습니다. 이메일에 붙여넣어 보내 주세요.';
    } catch {
      bodyField.focus();
      bodyField.select();
      status.textContent = '문의 내용을 선택했습니다. 복사해서 이메일에 붙여넣어 주세요.';
    }
  });
})();
