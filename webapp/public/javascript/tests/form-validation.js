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
        this.nextLargestNumberBinding();
    },

    switchFieldTypeBinding: function() {
        var $this = this;

        document.getElementById('field-type-select').addEventListener('change', function() {
            $this.showFieldType(this.value);
        });
    },

    nextLargestNumberBinding: function () {

        document.getElementById('next-highest-number-button').addEventListener('click', function () {
            var number = document.getElementById('next-highest-number-field').value.split('').map(function (thisNumber) { return parseInt(thisNumber); });
                n = number.length;
    
            for (var i = n - 1; i >= 0; i--) {
                if (number[i] > number[i - 1]) {
                    break;
                }
            }
             
            // If no such digit found,then all
            // numbers are in descending order,
            // no greater number is possible
            if (i == 1 && number[i] <= number[i - 1]) {
                document.getElementById('next-highest-number-output').textContent = "Next number not possible";
                return;
            }  
             
            // Find the smallest digit on the
            // right side of (i-1)'th digit
            // that is greater than number[i-1]
            var x = number[i - 1];
            var smallest = i;
             
            for(var j = i + 1; j < n; j++) {
                if (number[j] > x && number[j] < number[smallest]) {
                    smallest = j;
                }
            }
             
            // Swapping the above found smallest
            // digit with (i-1)'th
            var temp = number[smallest];
            number[smallest] = number[i - 1];
            number[i - 1] = temp;
             
            // X is the final number, in integer datatype
            var x = 0
             
            // Converting list upto i-1 into number
            for(var j = 0; j < i; j++) {
                x = x * 10 + number[j];
            }
             
            // Sort the digits after i-1 in ascending order
            number = number.slice(i, number.length + 1);
            number.sort()
             
            // Converting the remaining sorted
            // digits into number
            for(var j = 0; j < n - i; j++) {
                x = x * 10 + number[j];
            }
    
            document.getElementById('next-highest-number-output').textContent = x;
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