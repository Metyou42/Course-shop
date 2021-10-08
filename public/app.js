const numberFormat = function () {
  document.querySelectorAll('.price').forEach((node) => {
    node.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(node.textContent);
  });
};

const toDate = function () {
  document.querySelectorAll('.date').forEach((node) => {
    node.textContent = new Intl.DateTimeFormat('ru-Ru', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(node.textContent));
  });
};

numberFormat();
toDate();

function helper(id, query, func = null) {
  return function (str) {
    document.getElementById(id).setAttribute('data-error', `${str}`);
    query.className = 'validate invalid';

    if (func) func(query);
  };
}

const $card = document.querySelector('#card');

if ($card) {
  $card.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const { id } = event.target.dataset;
      const { csrf } = event.target.dataset;

      const status = (response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error(response.statusText));
      };

      fetch(`/card/remove/${id}`, {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrf,
        },
      })
        .then(status)
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            const html = card.courses
              .map((c) => `
                                <tr>
                                <td>${c.courseID.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove red" data-id="${c.courseID._id}">Удалить</button>
                                </td>
                                </tr>
                                `)
              .join('');

            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = card.price;

            numberFormat();
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>';
          }
        })
        .catch((error) => {
          console.log('Request failed', error);
        });
    }
  });
}

const $rpass = document.querySelector('#rpassword');
const $pass = document.querySelector('#password');

if ($rpass) {
  const button = document.querySelector('button');
  const csrf = document.getElementById('csrf');
  const rpassword = $rpass;
  const confirm = document.querySelector('#confirm');
  const remail = document.querySelector('#remail');
  const name = document.querySelector('#name');

  const helperRemail = helper('helper-remail', remail);
  const helperName = helper('helper-name', name);
  const helperRpassword = helper('helper-rpassword', rpassword);
  const helperConfirm = helper('helper-confirm', confirm);
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
  }

  button.addEventListener('click', (event) => {
    if (!rpassword.value.trim() || !remail.value.trim() || !name.value.trim() || confirm.value.trim() !== rpassword.value.trim() || validateEmail(remail.value.trim()) || rpassword.value.trim().length <= 5) {
      if (!remail.value.trim() || validateEmail(remail.value.trim())) helperRemail('введите email');
      if (!name.value.trim()) helperName('введите имя');
      if (!rpassword.value.trim()) helperRpassword('Введите пароль');
      if (rpassword.value.trim().length <= 5) helperRpassword('Пароль должен быть не меньше 6 символов');
      if (!confirm.value.trim()) helperConfirm('Введите пароль еще раз');
      if (confirm.value.trim() !== rpassword.value.trim()) helperConfirm('Пароли не совпадают');
    } else {
      fetch('/auth/register', {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrf.value,
        },
        body: JSON.stringify({
          email: remail.value,
          name: name.value,
          password: rpassword.value,
          confirm: confirm.value,
        }),
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            return response.json();
          }
        })
        .then((response) => {
          if (response.error === 'email incorect') {
            helperRemail('Ошибка email');

            rpassword.value = '';
            confirm.value = '';
          } else if (response.error === 'email has') {
            helperRemail('Пользователь с такой почтой уже зарегестрирован');

            rpassword.value = '';
            confirm.value = '';
          } else if (response.error === 'name min') {
            helperName('Имя должно быть не меньше 3 символов');
          } else if (response.error === 'pass min') {
            helperRpassword('Пароль должен быть не меньше 6 символов');
            confirm.value = '';
          } else if (response.error === 'Password not equel confirm') {
            helperConfirm('Пароли не совпадают');
          }
        })
        .catch((err) => {
          console.info(err);
        });
    }
  });
} else if ($pass) {
  const button = document.querySelector('button');
  const csrf = document.getElementById('csrf');
  const email = document.querySelector('#email');
  const password = $pass;

  const helperEmail = helper('helper-email', email);
  const helperPassword = helper('helper-password', password, (query) => {
    query.value = '';
  });
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
  }

  button.addEventListener('click', (event) => {
    if (!email.value.trim() || !password.value.trim() || validateEmail(email.value.trim())) {
      if (!email.value.trim()) helperEmail('Заполните поле');
      if (validateEmail(email.value.trim())) helperEmail('Введите email');
      if (!password.value.trim()) helperPassword('Заполните поле');
    } else {
      fetch('/auth/login', {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrf.value,
        },
        body: JSON.stringify({ email: email.value, password: password.value }),
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            return response.json();
          }
        })
        .then((response) => {
          if (response.error === 'incorect') {
            helperEmail('Неправильный пароль или логин');
            helperPassword('Неправильный пароль или логин');
          } else if (response.error === 'email incorect') {
            helperEmail('Ошибка email');
            helperPassword('Ошибка email');
          } else if (response.error === 'pass min') {
            helperPassword('Пароль должен быть не меньше 6 символов');
          }
        })
        .catch((err) => {
          console.info(err);
        });
    }
  });
}

const $resetemail = document.querySelector('#resetemail');
if ($resetemail) {
  const button = document.querySelector('button');

  const helperRemail = helper('helper-resetemail', $resetemail);
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
  }

  button.addEventListener('click', (e) => {
    if (!$resetemail.value.trim() || validateEmail($resetemail.value.trim())) {
      if (!$resetemail.value.trim()) helperRemail('Введите значение');
      if (validateEmail($resetemail.value.trim())) helperRemail('Введите email');
    } else {
      button.setAttribute('type', 'submit');
    }
  });
}

const $resetpass = document.getElementById('resetpass');

if ($resetpass) {
  const button = document.querySelector('button');
  const confirm = document.getElementById('confirm');
  const password = document.getElementById('password');

  const helperPassword = helper('helper-password', password);
  const helperConfirm = helper('helper-confirm', confirm);

  button.addEventListener('click', (e) => {
    if (!password.value.trim() || !confirm.value.trim() || confirm.value.trim() !== password.value.trim()) {
      if (confirm.value.trim() !== password.value.trim()) helperConfirm('Пароли не совпадают');
      if (!password.value.trim()) helperPassword('Введите значение');
      if (!confirm.value.trim()) helperConfirm('Введите значение');
    } else {
      button.setAttribute('type', 'submit');
    }
  });
}

const add_editCourse = document.getElementById('add_editCourse');

if (add_editCourse) {
  const button = document.querySelector('button');
  const title = document.getElementById('title');
  const price = document.getElementById('price');
  const img = document.getElementById('img');

  const helperTitle = helper('helper-title', title);
  const helperPrice = helper('helper-price', price, (query) => {
    query.value = '';
  });
  const helperImg = helper('helper-img', img);
  function validateFile(img) {
    const re = /.*\.(gif|jpe?g|bmp|png|jfif)$/gim;
    return !re.test(String(img).toLowerCase());
  }

  button.addEventListener('click', (e) => {
    if (!title.value.trim() || title.value.trim().length < 3 || !price.value.trim() || img.value.trim() === 'название файла' || !isFinite(price.value.trim()) || price.value.trim() < 0 || price.value.trim() > 99999 || validateFile(img.value)) {
      if (!title.value.trim()) helperTitle('Заполните поле!');
      if (title.value.trim().length < 3) helperTitle('Название курса должно содержать не менее 3симоволов!');
      if (!price.value) helperPrice('Заполните поле!');
      if (img.value === 'название файла' || validateFile(img.value)) helperImg('Загрузите фото!');
      if (price.value > 99999 || price.value < 0 || !isFinite(price.value)) helperPrice('Введите коректную цену');
    } else {
      button.setAttribute('type', 'submit');
    }
  });
}

const profile = document.getElementById('profile');

if (profile) {
  const name = document.getElementById('name');
  const button = document.querySelector('button');

  const helperName = helper('helper-name', name);

  button.addEventListener('click', (e) => {
    if (!name.value.trim() || name.value.trim().length <= 5) {
      if (!name.value.trim()) helperName('Заполните поле!');
      if (name.value.trim().length <= 3) helperName('Имя должно иметь не мене 3 символов');
    } else {
      button.setAttribute('type', 'submit');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.sidenav');
  const instances = M.Sidenav.init(elems, {});
});

M.Tabs.init(document.querySelectorAll('.tabs'));
