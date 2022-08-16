import { GithubUser } from './GithubUser.js'

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filterRedEntries = this.entries.filter(
      entry => entry.login !== user.login
    )
    this.entries = filterRedEntries

    this.update()
    this.save()
  }
}

export class favoritesView extends favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onEdd()
  }

  onEdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.creatRow()
      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`

      row.querySelector('.user img').alt = `imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }
  creatRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `

    <td class="user">
      <img
        src="https://github.com/maykbrito.png"
        alt="imagem de Mayk Brito"
      />
      <a target="_blank" href="https://github.com/maykbrito">
        <p>Mayk Brito</p>
        <span>maykbrito</span>
      </a>
    </td>
    <td class="repositories">76</td>
    <td class="followers">9589</td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
