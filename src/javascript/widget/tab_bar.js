class TabBar extends HTMLElement {}

class TabBarItem extends HTMLElement {
  constructor() {
    super();
    this.markup = (itemData) => `
        <input type="radio" name="tab-bar" class="tab-bar__item" id=${id} checked>
        <label class="tab-bar__button" for=${itemData.id}>
          <div class="tab-bar__icon"><img src=${itemData.iconImg} alt="icon"></div>
          <div class="tab-bar__text">${itemData.title}</i></div>
        </label>
        `;
  }
  set child(data){
      this.itemData = data.itemData;
      this.state = data.state;
  };
}
