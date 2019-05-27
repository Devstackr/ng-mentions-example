import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
  @ViewChild('suggestionsBox') suggestionsBoxElRef: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInputElRef: ElementRef<HTMLInputElement>;

  @Output('sendMessage') sendMessageEvent: EventEmitter<string> = new EventEmitter<string>();

  selected: string;

  suggestionsBoxVisible: boolean;

  inputEl: HTMLInputElement;

  // Usernames to be used for autocomplete
  usernames: string[] = [
    'Andy',
    'Bobby',
    'Gary',
    'Gina',
    'Jake',
    'Terry',
    'Holt',
    'Rosa',
    'Santiago'
  ];

  // Array for holding the filtered usernames (to be shown in autocomplete box)
  filteredUsernames: string[] = [];


  constructor() { }

  ngOnInit() {
    this.inputEl = this.messageInputElRef.nativeElement;
  }


  /**
   * Event handler
   * Is fired each time the input gains focus
   */
  onFocus() {
    this.handleSuggestions();
  }


  /**
   * Event handler
   * Is fired each time the user hovers over an item in the suggestions box
   */
  onResultItemHover(username: string) {
    this.selected = username;
  }


  /**
   * Event handler
   * Is fired each time the user clicks on an item in the suggestions box
   */
  onResultItemClick(username: string) {
    this.selected = username;
    this.autoComplete();
    this.inputEl.focus();
  }


  /**
   * Event handler
   * Is fired each time the user presses down a key in the input element
   */
  onKeyDown(event: KeyboardEvent) {
    
    if (this.suggestionsBoxVisible) {

      // If Up arrow key pressed
      if (event.keyCode === 38) {
        // Up arrow key was pressed
        
        let currentSelectedIndex = this.filteredUsernames.indexOf(this.selected);
        if (currentSelectedIndex === 0) {
          // Wrap around
          // if its the first element, then set it to the last
          this.selected = this.filteredUsernames[this.filteredUsernames.length - 1];
        } else {
          // otherwise decrease the index (so the selected goes nearer the top)
          this.selected = this.filteredUsernames[currentSelectedIndex - 1];
        }
  
        // Prevent default action (what would usually happen)
        event.preventDefault();
  
      } else if (event.keyCode === 40) {
        // Down arrow key pressed
        let currentSelectedIndex = this.filteredUsernames.indexOf(this.selected);
        if (currentSelectedIndex === this.filteredUsernames.length - 1) {
          // Wrap around
          // if its the last element, then set it to the first
          this.selected = this.filteredUsernames[0];
        } else {
          // otherwise increase the index (so the selected goes nearer the bottom)
          this.selected = this.filteredUsernames[currentSelectedIndex + 1];
        }
  
        // Prevent default action (what would usually happen)
        event.preventDefault();
      }
  
  
      // Scroll selected into view
      setTimeout(() => this.scrollSelectedIntoView(), 1);
      // ^ we need to use setTimeout() to ensure that this happens after UI is updated
      // This is because we are applying the selected class via [ngClass] 

    }
    
  }


  /**
   * Event handler
   * Is fired on key up within the input element
   */
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      // enter was pressed

      if (this.suggestionsBoxVisible && this.selected) {
        this.autoComplete();
      } else {
        // send the messaage
        this.sendMessageEvent.emit(this.inputEl.value);
        this.inputEl.value = '';
      }
    }

    this.handleSuggestions();
  }


  /**
   * Autocompletes the username that the user is typing
   */
  autoComplete() {
    if (this.selected) {
      let current = this.getCurrentWord();

      if (this.selected.length >= current.value.slice(1).length) {
        // we slice the value to remove the @ sign

        let inputValue = this.inputEl.value;
        let newInputValue
          = inputValue.slice(0, current.startIndex)
          + "@" + this.selected + " " + inputValue.slice(current.endIndex + 1);

        this.inputEl.value = newInputValue;

        // generate the new cursor position
        let newCursorPos = current.startIndex + this.selected.length + 2;
        // ^ we add 2 because of the '@' and the space we inserted before

        // set cursor position
        this.inputEl.selectionStart = newCursorPos;
        this.inputEl.selectionEnd = newCursorPos;
      }
    }
  }


  /**
   * Handles suggestions
   */
  handleSuggestions() {
    this.showSuggestionsBox();

    let wordBeingTyped = this.getCurrentWord().value.toLowerCase();

    // If the word being typed is a valid mention
    if (wordBeingTyped.startsWith('@') && !this.getSelectedText().includes(' ')) {

      // Filter and show usernames in the suggestions box
      let cache = this.filteredUsernames;
      this.filterUsernames(wordBeingTyped);


      if (this.filteredUsernames.length === 0) {
        this.hideSuggestionsBox();
      } else if (cache.length != this.filteredUsernames.length) {
        // if the filtered array changed (using length of arrays as the indicator of this)
        this.selected = this.filteredUsernames[0];
      }

    } else {
      // If the word being typed is not a valid mention
      this.hideSuggestionsBox();
    }

  }


  /**
   * Updates the filteredUsernames array based on a query
   * @param query the query to use when filtering
   */
  filterUsernames(query: string) {
    // In reality, these values will be retrieved via a backend
    // Searching (potentially) many thousands of users in the client is a bad idea

    // For demo purposes we will use some basic JS
    this.filteredUsernames = this.usernames.filter(username => {
      return ("@" + username.toLowerCase()).startsWith(query);
    });
  }


  /**
   * Get the current word being typed
   * @returns value (the actual word), start and end index (of the word in the input)
   */
  getCurrentWord(): TypedWord {
    let cursorLocation = this.inputEl.selectionStart;
    let value = this.inputEl.value;

    let firstHalf: string = "";
    // get first half of the word
    let i;
    for (i = cursorLocation - 1; i >= 0 && value[i] !== ' '; i--) {
      firstHalf += value[i];
    }

    // the for loop above puts the characters in the reverse order
    // so we have to reverse it to get it to the correct order
    firstHalf = firstHalf.split("").reverse().join("");

    // we add 1 because the for loop above performs i-- before performing the last check
    let startIndex = i + 1;


    let secondHalf: string = "";
    // get second half of the word
    for (i = cursorLocation; i < value.length && value[i] !== ' '; i++) {
      secondHalf += value[i];
    }

    // we subtract 1 because the for loop above performs i++ before performing the last check
    let endIndex = i - 1;

    return {
      value: firstHalf + secondHalf,
      startIndex,
      endIndex
    }
  }


  /**
   * Get the text that is selected in the input
   * @returns the text that is selected in the input
   */
  getSelectedText() {
    let start: number = this.inputEl.selectionStart;
    let end: number = this.inputEl.selectionEnd;
    return this.inputEl.value.substr(start, end - start);
  }


  /**
   * Scroll the selected item (in the autocomplete box) into view 
   */
  scrollSelectedIntoView() {
    let el = this.suggestionsBoxElRef.nativeElement.querySelector('.selected');
    if (el) this.scrollIntoView(this.suggestionsBoxElRef.nativeElement, el, 0, 10);
  }


  /**
   * Scroll an element (that is within a scrollable container) into view
   * Note: Smooth scroll works with css: scroll-behavior: smooth;
   * @param container The containing element (should be scrollable)
   * @param element The desired element to scroll into view
   * @param extraBottom bottom 'padding'
   * @param extraTop top 'padding'
   */
  scrollIntoView(container, element, extraBottom, extraTop) {
    //Determine container top and bottom
    let cTop = container.scrollTop;
    let cBottom = cTop + container.clientHeight;

    //Determine element top and bottom
    let eTop = element.offsetTop;
    let eBottom = eTop + element.clientHeight;

    //Check if out of view
    if (eTop < cTop) {
      container.scrollTop -= (cTop - eTop) + extraBottom;
    }
    else if (eBottom > cBottom) {
      container.scrollTop += (eBottom - cBottom) + extraTop;
    }
  }


  /**
   * Checks whether a given element is focused
   * @param el the element to perform the check on
   */
  isElementFocused(el: HTMLElement) {
    return (document.activeElement === el);
  }


  /**
   * Shows the suggestion box
   * Note: it just sets the boolean value to true
   * Assumes ngIf in the template
   */
  showSuggestionsBox() {
    this.suggestionsBoxVisible = true;
  }


  /**
   * Hides the suggestion box
   * Note: it sets the boolean value to false
   * Assumes ngIf in the template
   */
  hideSuggestionsBox() {
    this.suggestionsBoxVisible = false;
    this.selected = null;
  }
}



/**
 * An interface for a word that the user is typing
 * value: the actual word being typed
 * startIndex: the index position of the input where the word starts
 * endIndex: the index position of the input where the word ends
 */
interface TypedWord {
  value: string;
  startIndex: number;
  endIndex: number;
}