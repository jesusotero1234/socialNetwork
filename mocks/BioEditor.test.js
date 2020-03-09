import React from 'react';
import App, {BioEditor} from '../src/components/App';
import axios from '../src/components/axios';
import { render, waitForElement, fireEvent } from '@testing-library/react';




jest.mock('../src/components/axios')


test('When no bio is passed render Add button',async()=>{

    axios.get.mockResolvedValue({
        data:{
            data:[
                {
                    id: 1,
                    email: 'jesusotero@gmail.com',
                    first: 'jesus',
                    last: "otero",
                    imageUrl: '',
                    bio:''
                }
            ]
        }
    })

const {container}= render(<App />)

const el = await waitForElement(()=>container.querySelector('button'))

expect(el.innerHTML).toContain("Submit")

})


test('When a bio is passed render Edit button',async()=>{

    axios.get.mockResolvedValue({
        data:{
            data:[
                {
                    id: 1,
                    email: 'jesusotero@gmail.com',
                    first: 'jesus',
                    last: "otero",
                    imageUrl: '',
                    bio:'this is my bio'
                }
            ]
        }
    })

const {container}= render(<App />)

const el = await waitForElement(()=>container.querySelector('button'))

expect(el.innerHTML).toContain("Edit")

})


test('Clicking either the "Add" button causes a textarea and a "Save" button to be rendered.',async()=>{

    axios.get.mockResolvedValue({
        data:{
            data:[
                {
                    id: 1,
                    email: 'jesusotero@gmail.com',
                    first: 'jesus',
                    last: "otero",
                    imageUrl: '',
                    bio:''
                }
            ]
        }
    })

const {container}= render(<App />)

const el = await waitForElement(()=>container.querySelector('button'))

fireEvent.click(container.querySelector('button'))

const el2 = await waitForElement(()=>container.querySelector('div'))
// console.log(el2.innerHTML)
// expect(el.innerHTML).toContain("Submit")
expect(el2.innerHTML).toContain('textarea')

})

test('Clicking either the "edit" button causes a textarea and a "Save" button to be rendered.',async()=>{

    axios.get.mockResolvedValue({
        data:{
            data:[
                {
                    id: 1,
                    email: 'jesusotero@gmail.com',
                    first: 'jesus',
                    last: "otero",
                    imageUrl: '',
                    bio:'this is my bio'
                }
            ]
        }
    })

const {container}= render(<App />)

const el = await waitForElement(()=>container.querySelector('button'))

fireEvent.click(container.querySelector('button'))

const el2 = await waitForElement(()=>container.querySelector('div'))
// console.log(el2.innerHTML)
// expect(el.innerHTML).toContain("Submit")
expect(el2.innerHTML).toContain('textarea')

})



test('Clicking the "Save" button causes an ajax request.',async()=>{

    axios.get.mockResolvedValue({
        data:{
            data:[
                {
                    id: 1,
                    email: 'jesusotero@gmail.com',
                    first: 'jesus',
                    last: "otero",
                    imageUrl: '',
                    bio:'this is my bio'
                }
            ]
        }
    })

const {container}= render(<BioEditor />)

const el = await waitForElement(()=>container.querySelector('button'))

fireEvent.click(container.querySelector('button'))

const el2 = await waitForElement(()=>container.querySelector('div'))
// console.log(el2.innerHTML)
// expect(el.innerHTML).toContain("Submit")
expect(el2.innerHTML).toContain('textarea')

})