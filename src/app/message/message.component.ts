import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input('message') messageString: string;

  messageWords: MessageWord[];

  constructor() { }

  ngOnInit() {
    // Initialize the array
    this.messageWords = new Array<MessageWord>();

    this.parse();
  }


  /**
   * Parse the messageString and populate the messageWords array
   */
  parse() {
    // split up the message string
    let words: string[] = this.messageString.split(' ');

    words.forEach((word) => {
      if (word == '') {
        // If the word is an empty string, this means that it was an additional space
        // before we split it. So add a space to messageWords. 
        this.messageWords.push(new MessageWord(" "));
      }

      if (word.startsWith('@')) {
        let username = word;
        let properUsername = this.grabUsername(username);

        if (this.isValidUsername(properUsername)) {

          // Create and configure the MessageWord object
          let formattedWord = new MessageWord(properUsername);
          formattedWord.link = this.generateMentionLink(properUsername);

          this.messageWords.push(formattedWord);

          // Check whether we have a remainder string
          // this will occur if there are non-alphanumeric characters at the end of the word
          // e.g. such as punctuation
          if (username.length !== properUsername.length) {
            // then we have a remainder string
            let remainder = username.substr(properUsername.length);
            this.messageWords.push(new MessageWord(remainder));
          }
        } else {
          // Username wasn't valid
          // So we treat it like a regular word (push it without a link)
          this.messageWords.push(new MessageWord(word));
        }

      } else {
        // If word isn't a mention, push it without a link
        this.messageWords.push(new MessageWord(word));
      }

      // push a space (at the end of each word)
      this.messageWords.push(new MessageWord(" "));

    })
  }
  

  /**
   * Performs validity checks on the username
   * @param username 
   * @returns true if valid, false otherwise
   */
  isValidUsername(username: string) {
    return username.length >= 3 &&
      username.length <= 35 &&
      username[0] === '@' &&
      !username.includes(' ') &&
      this.isAlphaNumeric(username.substr(1));  // is the username alphanumeric (ignore the first char, it is the @ symbol)
  }
  

  /**
   * Generate a URL for a user profile based on the username
   * @param word username with @ symbol prefixed
   */
  generateMentionLink(word: string): string {
    let username = word.substr(1); // do this to remove the @ symbol
    return `users/${username}`;
  }


  /**
   * Checks whether a string is alphanumeric
   * Can be used to check both multi and single character strings
   * @param str the string to check
   */
  isAlphaNumeric(str: string) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };


  /**
   * Words can contain both usernames and 'regular' text
   * This is mainly so that the user is able to use punctuation
   * This system presumes that usernames are alphanumeric strings
   * @param str The string to grab the username from
   *            Must start with an @ symbol, otherwise str is just returned back
   */
  grabUsername(str: string) {
    let username = '@';
    // start loop on second character (first character will be the @ symbol)
    for (let i = 1; i < str.length; i++) {
      if (this.isAlphaNumeric(str[i])) {
        username += str[i];
      } else {
        // non-alpha character found
        // so username has ended
        return username;
      }
    }
    return username;
  }

}

/**
 * Model for the final parsed word in the message
 */
export class MessageWord {
  constructor(
    public text: string,
    public link?: string
  ) { }
}