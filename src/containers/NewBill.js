import {ROUTES_PATH} from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
    constructor({document, onNavigate, firestore, localStorage}) {
        this.document = document
        this.onNavigate = onNavigate
        this.firestore = firestore
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)
        this.fileUrl = null
        this.fileName = null
        this.validFile = false
        new Logout({document, localStorage, onNavigate})
    }

    handleChangeFile = e => {
        const file = this.document.querySelector(`input[data-testid="file"]`).files[0]

        if (file && !/\.(jpeg|png|jpg)$/gi.test(file.name)) {
            this.validFile = false
        } else if (file) {
            this.firestore
            .storage
            .ref(`justificatifs/${file.name}`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                this.fileUrl = url
                this.fileName = file.name
                this.validFile = true
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        if (this.validFile) {
            const email = JSON.parse(localStorage.getItem("user")).email
            const bill = {
                email,
                type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
                name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
                amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
                date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
                vat: e.target.querySelector(`input[data-testid="vat"]`).value,
                pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
                commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
                fileUrl: this.fileUrl,
                fileName: this.fileName,
                status: 'pending'
            }

            this.createBill(bill)
            this.onNavigate(ROUTES_PATH['Bills'])
        } else {
            alert('c\'est pas bon')
        }
    }

    // not need to cover this function by tests
    createBill = (bill) => {
        if (this.firestore) {
            this.firestore
                .bills()
                .add(bill)
                .then(() => {
                    this.onNavigate(ROUTES_PATH['Bills'])
                })
                .catch(error => error)
        }
    }
}