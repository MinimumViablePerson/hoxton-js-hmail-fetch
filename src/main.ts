import './style.css'

type Email = {
  from: string
  header: string
  content: string
  emailAddress: string
  img: string
  read: boolean
}

type State = {
  emails: Email[]
  selectedEmail: Email | null
  filter: string
  show: 'emails' | 'details' | 'new-email'
}

const state: State = {
  emails: [],
  selectedEmail: null,
  filter: '',
  show: 'emails'
}

function selectEmail (email: Email) {
  email.read = true
  state.selectedEmail = email
  state.show = 'details'
}

function deselectEmail () {
  state.selectedEmail = null
  state.show = 'emails'
}

// input: newFilter: string
// action: update filter and go back to emails page
// output: undefined
function filterEmails (newFilter: string) {
  state.filter = newFilter
  state.show = 'emails'
  state.selectedEmail = null
}

// Q: What emails do we have? ✅ state.emails
// Q: Should we be showing the list or the details of an email? ✅ state.selectedEmail === null ?
// Q: If we are showing an email, which email details should we be showing? ✅ state.selectedEmail

// FILTER FEATURE
// Q: Has the user entered a filter? ✅ state.filter
// Q: What emails should we be showing on the list? state.emails.filter

// input: nothing
// action: gives me only the emails that match the filter
// output: the filtered emails
function getFilteredEmails () {
  return state.emails.filter(
    email =>
      email.content.toLowerCase().includes(state.filter.toLowerCase()) ||
      email.from.toLowerCase().includes(state.filter.toLowerCase()) ||
      email.header.toLowerCase().includes(state.filter.toLowerCase()) ||
      email.emailAddress.toLowerCase().includes(state.filter.toLowerCase())
  )
}

function renderEmailListItem (email: Email, listEl: HTMLUListElement) {
  let liEl = document.createElement('li')
  liEl.className = email.read ? 'emails-list__item read' : 'emails-list__item'
  liEl.addEventListener('click', function () {
    selectEmail(email)
    render()
  })

  // if (email.read) liEl.className = 'emails-list__item read'
  // else liEl.className = 'emails-list__item'

  // liEl.className = 'emails-list__item'
  // if (email.read) liEl.classList.add('read')

  let readIconEl = document.createElement('span')
  readIconEl.className =
    'emails-list__item__read-icon material-symbols-outlined'
  readIconEl.textContent = email.read ? 'mark_email_read' : 'mark_email_unread'

  let imgEl = document.createElement('img')
  imgEl.className = 'emails-list__item__image'
  imgEl.src = email.img

  let fromEl = document.createElement('p')
  fromEl.classList.add('emails-list__item__from')
  fromEl.textContent = email.from

  let contentEl = document.createElement('p')
  contentEl.className = 'emails-list__item__content'
  contentEl.textContent = email.header
  liEl.append(readIconEl, imgEl, fromEl, contentEl)

  listEl.appendChild(liEl)
}

function renderEmailList () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return
  mainEl.textContent = ''

  let titleEl = document.createElement('h1')
  titleEl.textContent = 'Inbox'

  let newEmailButton = document.createElement('button')
  newEmailButton.className = 'new-email-button'
  newEmailButton.textContent = '+'
  newEmailButton.addEventListener('click', function () {
    state.show = 'new-email'
    render()
  })

  titleEl.append(newEmailButton)

  let listEl = document.createElement('ul')
  listEl.className = 'emails-list'

  let filteredEmails = getFilteredEmails()

  for (let email of filteredEmails) {
    renderEmailListItem(email, listEl)
  }

  mainEl.append(titleEl, listEl)
}

function renderEmailDetails () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return
  if (state.selectedEmail === null) return

  mainEl.textContent = ''

  let backButton = document.createElement('button')
  backButton.textContent = 'BACK'
  backButton.addEventListener('click', function () {
    deselectEmail()
    render()
  })

  let titleEl = document.createElement('h1')
  titleEl.textContent = state.selectedEmail.from

  let imgEl = document.createElement('img')
  imgEl.className = 'email-details__image'
  imgEl.src = state.selectedEmail.img

  let headerEl = document.createElement('h2')
  headerEl.className = 'email-details__header'
  headerEl.textContent = state.selectedEmail.header

  let contentEl = document.createElement('p')
  contentEl.className = 'email-details__content'
  contentEl.textContent = state.selectedEmail.content

  mainEl.append(backButton, titleEl, imgEl, headerEl, contentEl)
}

function renderNewEmailForm () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return
  mainEl.textContent = ''
  // <form>
  //   <input type="text" placeholder="to" />
  //   <input type="text" placeholder="subject" />
  //   <textarea placeholder="message"></textarea>
  //   <button type="submit">Send</button>
  // </form>
  let h2El = document.createElement('h2')
  h2El.textContent = 'New email section'

  mainEl.append(h2El)
}

function render () {
  console.log('current state:', JSON.stringify(state, null, 2))
  // if there is a selected email, show the details
  // if not, show the list
  if (state.show === 'details') renderEmailDetails()
  if (state.show === 'emails') renderEmailList()
  if (state.show === 'new-email') renderNewEmailForm()
}

function getEmails () {
  fetch('http://localhost:3000/emails')
    .then(resp => resp.json())
    .then(emailsFromTheServer => {
      state.emails = emailsFromTheServer
      render()
    })
}

function runThisOnlyAtTheStart () {
  let logoEl = document.querySelector('.logo')
  if (logoEl) {
    logoEl.addEventListener('click', function () {
      deselectEmail()
      render()
    })
  }

  let inputEl = document.querySelector<HTMLInputElement>('.filter-input')
  if (inputEl) {
    inputEl.addEventListener('keydown', function (event) {
      if (inputEl == null) return
      if (event.key !== 'Enter') return

      filterEmails(inputEl.value)
      render()
    })
  }

  getEmails()
}

runThisOnlyAtTheStart()
render()
