function validation() {

    try {
        var msform = document.querySelector("#msform ");
        var surname = document.querySelector("#surname ");
        var btn_next = document.querySelector("#next ");
        var name = document.querySelector("#name ");
        var gender = document.querySelector("#gender ");
        var dob = document.querySelector("#dob ");
        var race = document.querySelector("#race ");
        var enroll_date = document.querySelector("#enroll_date ");
        var import_info = document.querySelector("#import_info ");

        surname.style.border = "1px solid red ";
        name.style.border = "1px solid red ";
        gender.style.border = "1px solid red ";
        dob.style.border = "1px solid red ";
        race.style.border = "1px solid red ";
        enroll_date.style.border = "1px solid red ";
        import_info.style.border = "1px solid red ";
        btn_next.style.backgroundColor = "grey ";

        msform.addEventListener('input', () => {
            if (surname.value.length > 3 && name.value.length > 3 && gender.value.length > 3 &&
                dob.value.length > 3 && race.value.length > 3 && enroll_date.value.length > 3 && import_info.value.length > 2) {
                btn_next.style.backgroundColor = "green ";
                btn_next.removeAttribute('disabled');
            } else {
                // surname.style.border = "1px solid green ";
                // name.style.border = "1px solid green ";
                // gender.style.border = "1px solid green ";
                // dob.style.border = "1px solid green ";
                // race.style.border = "1px solid green ";
                // enroll_date.style.border = "1px solid green ";
                // import_info.style.border = "1px solid green ";
                btn_next.setAttribute('disabled', 'disabled');
            }
        });

    } catch (err) {
        document.getElementById("error ").innerHTML = err.message;
    }
}