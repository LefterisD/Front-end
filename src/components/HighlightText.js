import React, { Component } from "react";
export default class HighlightText extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "a" };
    this.search = this.search.bind(this);
  }
  search(event) {
    this.setState({ searchText: event.target.value });
  }
  _getText(text, searchText, mistakes) {
    return searchText
      ? this._getTextWithHighlights(text, searchText, mistakes)
      : text;
  }
  _getTextWithHighlights(text, searchText, mistakes) {
    let newText = "";
    mistakes.map((word, i) => {
      let regex = new RegExp(word, "gi");
      newText = text.replace(regex, `<mark class="highlight">$&</mark>`);
      text = newText;
    });
    this.props.setHighlightedText(newText);
    return <span dangerouslySetInnerHTML={{ __html: newText }} />;
  }
  render() {
    const { cite, text, wordsToHighlight } = this.props;
    const { searchText } = this.state;
    const textToShow = this._getText(text, searchText, wordsToHighlight);
    return (
      <div className="container">
        <div className="search-container">
          <input
            id="search-input-hidden"
            placeholder="Type `web` for example"
            type="search"
            autoComplete="off"
            onChange={this.search}
            value={searchText}
          />
        </div>
        <blockquote cite={cite}>{textToShow}</blockquote>
      </div>
    );
  }
}
