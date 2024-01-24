"use strict";

/*--Block-8/#26 "Become our partner"--*/

/*Перевірка що документ вже завантажений:*/
document.addEventListener('DOMContentLoaded', function () {
	const formPartners = document.getElementById('formPartners');
	const formMentors = document.getElementById('formMentors');
	/*перехват форми перед відправленням*/

	formPartners.addEventListener('submit', formPartnersSend);
	formMentors.addEventListener('submit', formMentorsSend);

	function formPartnersSend(e) {
		e.preventDefault();
		/*забороняю стандарну відправку форми при натисканні кнопки*/

		let error = formValidate(formPartners);
		/*усю форму присвоюю ф-ї formValidate для наступної перевірки*/

		if (error === 0) {
			alert("Дякуємо! Ваша анкета успішно відправлена. Наш менеджер зв’яжеться з Вами в найближчий час.");

			// Скриваємо анкету для Партнерів
			const formContainer = document.getElementById("blk-26-Partners-popup");
			formContainer.style.display = "none";
		} else {
			alert('Заповніть обов"язкові поля');
		}
	}

	function formMentorsSend(e) {
		e.preventDefault();
		/*забороняю стандарну відправку форми при натисканні кнопки*/

		let error = formValidate(formMentors);
		/*усю форму присвоюю ф-ї formValidate для наступної перевірки*/

		if (error === 0) {
			alert("Дякуємо! Ваша анкета успішно відправлена. Наш менеджер зв’яжеться з Вами в найближчий час.");

			// Скриваємо анкету для Викладачів/Менторів
			const formContainer = document.getElementById("blk-26-Mentors-popup");
			formContainer.style.display = "none";
		} else {
			alert('Заповніть обов"язкові поля');
		}
	}

	function formValidate(form) {
		let error = 0;
		let formReq = form.querySelectorAll('.blk-26-req');
		/*в змінну присвоюю всі поля з .-req (requirement - обов"язкові до заповнення)*/

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			/*в данному циклі перебираю обов"язкові поля */
			formRemoveError(input);

			/*Перевірка полів - якщо тест не пройдено додаэться клас .-error блоку та його батьківському елементу теж:*/
			if (input.classList.contains('blk-26-email')) {
				if (emailTest(input.value)) { // Передаєм значення поля
					formAddError(input);
					error++;
				}
			} else if (input.classList.contains('blk-26-phone')) { // Убираем символ # перед классом
				if (phoneTest(input.value)) { // Передаєм значення поля
					formAddError(input);
					error++;
				}
			} else if (input.id === 'blk-26-name' || input.name === 'lastname') {
				if (!validateName(input.value)) { // Передаєм значення поля
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}

		return error;
	}

	/*Допоміжна функція що додає самому об"єкту клас .-error і його батьківському елементу теж додає клас .-error*/
	function formAddError(input) {
		input.parentElement.classList.add('blk-26-error');
		input.classList.add('blk-26-error');
	}

	/*Допоміжна функція діє навпаки від "formAddError" - забирає в об"єкта клас .-error і у його батьківського елемента теж*/
	function formRemoveError(input) {
		input.parentElement.classList.remove('blk-26-error');
		input.classList.remove('blk-26-error');
	}

	/*Функція перевірки на коректність введених данних користувачем:*/
	function emailTest(value) { //  Передаєм значення поля
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value); // Використовуємо передане значення
	}

	function phoneTest(value) { //  Передаєм значення поля
		return !/^(0(97|93|63|50|67|98|68))-?\d{3}-?\d{2}-?\d{2}$/.test(value); // Використовуємо передане значення
	}

	function validateName(value) { //  Передаєм значення поля
		const name = value.trim(); // Використовуємо передане значення
		return name.length >= 2 && name.length <= 20 && !/\d/.test(name);
	}
});

//-----------------------------------------------

// Обовьязковий js для підключення google recaptcha
window.onload = function () {
	listenMentorsSubmit();
};

function getElement(selector) {
	return document.querySelector(selector);
}

function onSubmit(event) {
	event.preventDefault();
	grecaptcha.ready(function () {
		grecaptcha.execute('6LcwRRUaAAAAADavxcmw5ShOEUt1xMBmRAcPf6QP', { action: 'submit' }).then(function (token) {
			const formElement = getElement('#formMentors');
			if (formElement.checkValidity()) {
				const actionUrl = 'https://intita.com/api/v1/entrant';
				const mentorsFormData = new FormData(formElement);
				mentorsFormData.append('g-recaptcha-response', token);
				const http = new XMLHttpRequest();
				http.open('POST', actionUrl, true);
				http.onreadystatechange = function () {
					if (+http.readyState === 4 && +http.status === 201) {
						mentorsSubmitResponse();
					} else if (+http.status === 400) {
						mentorsSubmitResponse('Помилка сервера. Зробіть ще одну спробу');
					}
				}
				http.onload = function () {
					if (+http.status !== 201) {
						mentorsSubmitResponse('Помилка сервера. Зробіть ще одну спробу');
						return;
					}
					mentorsSubmitResponse();
				}
				http.send(mentorsFormData);
			} else {
				let index = 0;
				for (let el of formElement.elements) {
					const attrName = el.getAttribute('name');
					if (['name', 'email', 'phone'].includes(attrName)) {
						if (el.value) {
							el.classList.remove('input-error');
						} else {
							el.classList.add('input-error');
							if (index === 0) { el.scrollIntoView() }
							index++;
						}
					}
				}
			}
		});
	});
}

function listenMentorsSubmit() {
	const element = getElement('#formMentors input[type="submit"]');
	element.addEventListener('click', onSubmit);
}

function mentorsSubmitResponse(errorStr = 'Ваша анкета успішно відправлена') {
	const elementResponse = getElement('#formMentors_response');
	if (getComputedStyle(elementResponse, null).display === 'none') {
		if (errorStr) {
			const elementAnketeText = getElement('#formMentors .ankete-text');
			elementAnketeText.innerText = errorStr;
		}
		elementResponse.style.display = 'grid';
	}
	scroll(0, 0);
}

	  // Кінець google recaptcha


//===================================================


