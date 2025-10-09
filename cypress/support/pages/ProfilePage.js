import PageObject from './PageObject';

class ProfilePage extends PageObject {
    getBioField() {
        return this.getByDataCy('bio');
    }

    getUsernameField() {
        return this.getByDataCy('username');
    }

    getEmailField() {
        return this.getByDataCy('email');
    }

    getPasswordField() {
        return this.getByDataCy('password');
    }

    getUpdateButton() {
        return this.getByDataCy('update-profile');
    }

    updateBio(bio) {
        this.getBioField().clear().type(bio);
    }

    updateUsername(username) {
        this.getUsernameField().clear().type(username);
    }

    updateEmail(email) {
        this.getEmailField().clear().type(email);
    }

    updatePassword(password) {
        this.getPasswordField().clear().type(password);
    }

    submit() {
        this.getUpdateButton().click();
    }
}

export default ProfilePage;
