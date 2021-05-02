import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES} from "../constants/routes";
import {bills} from "../fixtures/bills";
import {localStorageMock} from "../__mocks__/localStorage";
import {screen} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import firebase from "../__mocks__/firebase";
import DashboardUI from "../views/DashboardUI";


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then I put file on input file", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const firestore = {
                storage: {
                    ref: jest.fn().mockReturnValue({
                        put: jest.fn().mockResolvedValue({
                            ref: {
                                getDownloadURL: jest.fn().mockResolvedValue({})
                            }
                        })
                    })
                }
            }
            const newBill = new NewBill({
                document, onNavigate, firestore, bills, localStorage: window.localStorage
            })

            const file = new File(['hello'], 'hello.png', { type: 'image/png' })

            const handleChangeFile = jest.fn(newBill.handleChangeFile)
            const input = screen.getByTestId('file')
            input.addEventListener('click', handleChangeFile)
            userEvent.upload(input, file)
            expect(handleChangeFile).toHaveBeenCalled()
        })

        test("Then I submit form", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            //to-do write assertion
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const firestore = null

            const newBill = new NewBill({
                document, onNavigate, firestore, bills, localStorage: window.localStorage
            })

            const handleSubmit = jest.fn(newBill.handleSubmit)
            const form = screen.getByTestId('form-new-bill')
            form.addEventListener('submit', handleSubmit)
            form.submit()
            expect(handleSubmit).toHaveBeenCalled()
        })
    })


    describe("When you send New bill", () => {
        test("Post new bill from mock API POST", async () => {
            const getSpy = jest.spyOn(firebase, "post")
            const newBills = await firebase.post()
            expect(getSpy).toHaveBeenCalledTimes(1)
            expect(newBills).toEqual({})
        })
    })
})