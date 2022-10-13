var form_validation = {
    load: function() {
        this.createFieldSelectOptions();
        this.bindings();

        var firstFieldType = document.getElementById('field-type-select').value;
        this.showFieldType(firstFieldType);
    },

    bindings: function() {
        this.switchFieldTypeBinding();
        this.testRegistrationFormBinding();
        this.isANumberBinding();
    },

    switchFieldTypeBinding: function() {
        var $this = this;

        document.getElementById('field-type-select').addEventListener('change', function() {
            $this.showFieldType(this.value);
        });
    },

    isANumberBinding: function() {
        document.getElementById('is-a-number-button').addEventListener('click', function() {
            var userInput = document.getElementById('is-a-number-field').value.replace(' ', '');

            if (!!userInput.length) {
                if (isNaN(userInput)) {
                    document.getElementById('is-a-number-result').textContent = 'Input is not a number';
                } else {
                    document.getElementById('is-a-number-result').textContent = 'Input is a number';
                }
            } else {
                document.getElementById('is-a-number-result').textContent = 'No user input provided';
            }
        });
    },

    testRegistrationFormBinding: function() {
        document.getElementById('challenger-register-button').addEventListener('click', function() {
            var email = document.getElementById('email').value,
                password = document.getElementById('password').value,
                passwordVerify = document.getElementById('password-verify').value;

            var emailErrors = [],
                passwordErrors = [],
                passwordVerifyErrors = [];

            if (!email) {
                emailErrors.push('Email not entered');
            } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                emailErrors.push('Please enter a valid email address');
            }

            if (!password) {
                passwordErrors.push('Password not entered');
            }

            if (!!password) {
                if (!passwordVerify) {
                    passwordVerifyErrors.push('Password verification not entered');
                } else if (passwordVerify !== password) {
                    passwordVerifyErrors.push('Passwords do not match');
                }
            }

            if (!!emailErrors.length) {
                document.getElementById('email-error').textContent = emailErrors.join(', ');
            } else {
                document.getElementById('email-error').textContent = '';
            }

            if (!!passwordErrors.length) {
                document.getElementById('password-error').textContent = passwordErrors.join(', ');
            } else {
                document.getElementById('password-error').textContent = '';
            }

            if (!!passwordVerifyErrors.length) {
                document.getElementById('password-verify-error').textContent = passwordVerifyErrors.join(', ');
            } else {
                document.getElementById('password-verify-error').textContent = '';
            }
        });
    },

    createFieldSelectOptions: function() {
        var fieldTypes = document.getElementsByClassName('field-type');

        for (var i = 0; i <= fieldTypes.length - 1; i++) {
            var thisFieldType = fieldTypes[i];

            var option = document.createElement('option');
            option.value = thisFieldType.id;
            option.textContent = thisFieldType.id.split('-').join(' ').capitalizeEachFirstLetters();

            if (i == 0) {
                option.selected = true;
            }

            document.getElementById('field-type-select').appendChild(option);
        }
    },

    showFieldType: function(field) {
        if (!!document.getElementsByClassName('active')[0]) {
            document.getElementsByClassName('active')[0].style = 'display: none;'
            document.getElementsByClassName('active')[0].classList = document.getElementsByClassName('active')[0].classList.value.replace(' active', '');
        }

        document.getElementById(field).classList += ' active';
        document.getElementById(field).style = '';
    }
};

window['form_validation'] = form_validation;