
let selected_review;

function insertReviews() {
  const { el, list, mount } = redom;

  class Review {
    constructor() {
      this.owner = el( 'h3.owner' );
      this.text = el( 'p' );
      this.state = el( 'span' );

      this.el = el( 'li.review', [this.text, this.owner, this.state] );
    }

    update( data ) {
      this.owner.textContent = data.owner;
      this.text.textContent = data.text;
      this.state.textContent = data.state;
    }
  }

  const ul = list( 'ul.review-carousal', Review );
  mount( document.querySelector( '#reviews > .review-carousal_parent' ), ul );

  ul.el.onclick = e => {
    e.preventDefault();

    const card = find( e.target, 'review' );
    if ( card && card !== selected_review ) {
      card.classList.add( 'selected' );
      if ( selected_review ) selected_review.classList.remove( 'selected' );
      selected_review = card;
    }
  };


  // FIXME data should be loaded here
  const reviews = ( () => {
    const array = new Array( 10 );
    for ( let index = 0; index < array.length; index++ )
      array[index] = {
        text:
          'Lorem ipsum is Simply dummy text of the printing and typeset industry. Lorem ipsum has been the industry\'s standard dummy text ever hen an with new version',
        owner: 'Client Name',
        state: 'United States'
      };

    return array;
  } )();

  ul.update( reviews );
}

let selected_card;

function insertSpecialOffers() {
  const { el, list, mount, setStyle } = redom;

  class Card {
    constructor() {
      this.img = el( 'div.img' );

      this.subtitle = el( 'span' );
      this.title = el( 'h3', ' ', this.subtitle );
      this.button = el( 'button', el( 'span.fa.fa-chevron-down' ) );

      this.content = el( 'div.content', [this.title, this.button] );
      this.el = el( 'li.card', [this.img, this.content] );
    }

    update( data ) {
      this.title.childNodes[0].nodeValue = data.title;
      this.subtitle.textContent = data.subtitle;
      setStyle( this.img, { backgroundImage: `url(${data.img})` } );
    }
  }

  const ul = list( 'ul.review-carousal', Card );
  mount( document.querySelector( '#special-offers > div > .cards' ), ul );

  ul.el.onclick = e => {
    e.preventDefault();
    const card = find( e.target, 'card' );

    if ( card && card !== selected_card ) {
      card.classList.add( 'selected' );
      if ( selected_card ) selected_card.classList.remove( 'selected' );
      selected_card = card;
    }
  };

  function card( title, subtitle, image ) {
    return {
      title,
      subtitle: subtitle || 'New Destination!',
      img: `https://source.unsplash.com/${image}/300x400`
    };
  }

  // FIXME data should be loaded here
  const offers = [
    card( 'Statue of liberty', null, 'DF1hKdVsn_c' ),
    card( 'Spectacular Seychelles', null, 'UTP7ob5Kz9U' ),
    card( 'Hong kong & Macau', 'Bonus Extras!', 'vpNtiucFhck' ),
    card( 'Vietnam Highlights', null, 'tCM6cQjIQ7Q' ),
    card( 'Spectacular Seychelles', null, 'FL8x-cTELok' )
  ];

  ul.update( offers );
}

function find( element, cls ) {
  console.log( element, cls, element.parentElement );

  if ( !element || element === document.body ) return;

  if ( element.classList.contains( cls ) ) return element;
  else return find( element.parentElement, cls );
}

insertReviews();
insertSpecialOffers();

let selected_holiday;

document.querySelector( '#holiday-types > .types' ).onclick = e => {
  e.preventDefault();

  const card = find( e.target, 'card' );
  console.log( card );
  if ( card && card !== selected_holiday ) {
    card.classList.add( 'selected' );
    if ( selected_holiday ) selected_holiday.classList.remove( 'selected' );
    selected_holiday = card;
  }
};