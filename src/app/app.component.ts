import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  widthDims = 370;
  widthDiags = 500;
  move = 0;
  blockValue = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  outputs = ['', '', '', '', '', '', '', '', ''];
  winningType = [0, 0, 0, 0, 0, 0, 0, 0];
  value = 'X';
  winValue = '';
  turn = 0;
  btns_disable = false;
  mode = 'Easy';
  winner = 'Hello';
  winnerDisplay = 'none';
  active_user_turn = 'active_turn';
  active_ai_turn = '';
  fillBlock(id: number) {
    // this.validateMove(id, this.blockValue)
    let invalidMove = this.validateMove(id, this.blockValue);
    if (invalidMove) {
      return;
    }
    this.move++;
    this.blockValue[id] = 1;
    for (let i = 0; i < this.blockValue.length; i++) {
      if (this.blockValue[i] === 1 && this.outputs[i] === '') {
        this.outputs[i] = this.value;
      }
    }
    if (this.value === 'X') {
      this.value = 'O';
    } else {
      this.value = 'X';
    }

    let winValidate = this.checkForWin(this.outputs);
    if (winValidate !== '') {
      this.restartDelay(2000, 'player');
      this.winner = 'You win';
      this.winnerDisplay = 'flex';
      setTimeout(() => {
        this.winner = '';
        this.winnerDisplay = 'none';
      }, 2000);
      return;
    }
    
    if (this.outputs.indexOf('') == -1) {
      this.restartDelay(1000, 'draw');
      this.winner = 'Match drawn';
      this.winnerDisplay = 'flex';
      setTimeout(() => {
        this.winner = '';
        this.winnerDisplay = 'none';
      }, 2000);
      return;
    }
    this.turn = Number(!this.turn);

    if (this.turn === 1) {
      this.aiTurn(this.blockValue, this.outputs);
      this.turn = Number(!this.turn);
    }
  }

  aiTurn(blockValue: any[], outputs: any[]) {
    this.active_user_turn = '';
    this.active_ai_turn = 'active_turn';
    setTimeout(() => {
      let leftOptions = [];
      for (let i = 0; i < outputs.length; i++) {
        if (outputs[i] === '') {
          leftOptions.push(i);
        }
      }
      if (this.mode === 'Easy') {
        this.playEasy(leftOptions, outputs);
      } else if (this.mode === 'Hard') {
        this.playHard(leftOptions, outputs);
      } else if (this.mode === 'Impossible') {
        this.playImpossible(leftOptions, outputs);
      }
      let winValidate = this.checkForWin(outputs);
      if (winValidate !== '') {
        this.winner = 'AI wins'
        this.winnerDisplay = 'flex';
        setTimeout(() => {
          this.winner = '';
          this.winnerDisplay = 'none';
        }, 2000);
        this.restartDelay(2000, 'ai');
      }
      this.active_user_turn = 'active_turn';
      this.active_ai_turn = '';
    }, 1000);
  }

  playEasy(leftOptions: any[], outputsImpossible: any[]) {
    
    let aiSelected =
      leftOptions[Math.floor(Math.random() * leftOptions.length)];
    this.outputs[aiSelected] = this.value;
    if (this.value === 'X') {
      this.value = 'O';
    } else {
      this.value = 'X';
    }
    
  }

  playHard(leftOptions: any[], outputsImpossible: any[]) {
    let winMoveUser = this.predictWinMove(outputsImpossible, 'X');
    let winMoveAI = this.predictWinMove(outputsImpossible, 'O');
    if (winMoveAI.length != 0 || winMoveUser.length != 0) {
      // If AI has a chance to win, then it will do the winning move.
      if (winMoveAI.length != 0) {
        this.outputs[winMoveAI[0]] = this.value;
        if (this.value === 'X') {
          this.value = 'O';
        } else {
          this.value = 'X';
        }
        return;
      }

      // If AI doesn't have a winning move and can block user's winning move, then it will be blocked.
      if (winMoveUser.length != 0) {
        this.outputs[winMoveUser[0]] = this.value;
        if (this.value === 'X') {
          this.value = 'O';
        } else {
          this.value = 'X';
        }
      }
    } else {
      let aiSelected =
        leftOptions[Math.floor(Math.random() * leftOptions.length)];
      this.outputs[aiSelected] = this.value;
      if (this.value === 'X') {
        this.value = 'O';
      } else {
        this.value = 'X';
      }
    }
  }

  playImpossible(leftOptions: any[], outputsImpossible: any[]) {
    let winMoveUser = this.predictWinMove(outputsImpossible, 'X');
    let winMoveAI = this.predictWinMove(outputsImpossible, 'O');
    if (winMoveAI.length != 0 || winMoveUser.length != 0) {
      // If AI has a chance to win, then it will do the winning move.
      if (winMoveAI.length != 0) {
        this.outputs[winMoveAI[0]] = this.value;
        if (this.value === 'X') {
          this.value = 'O';
        } else {
          this.value = 'X';
        }
        return;
      }

      // If AI doesn't have a winning move and can block user's winning move, then it will be blocked.
      if (winMoveUser.length != 0) {
        this.outputs[winMoveUser[0]] = this.value;
        if (this.value === 'X') {
          this.value = 'O';
        } else {
          this.value = 'X';
        }
      }
    } else if (0) {

    } else {
      let aiSelected =
        leftOptions[Math.floor(Math.random() * leftOptions.length)];
      this.outputs[aiSelected] = this.value;
      if (this.value === 'X') {
        this.value = 'O';
      } else {
        this.value = 'X';
      }
    }
  }

  checkForWin(outputsForWin: any[]) {
    if (
      outputsForWin[0] === outputsForWin[1] &&
      outputsForWin[1] === outputsForWin[2] &&
      outputsForWin[2] != ''
    ) {
      this.winValue = 'row1';
      this.winningType[0]++;
    } else if (
      outputsForWin[3] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[5] &&
      outputsForWin[5] != ''
    ) {
      this.winValue = 'row2';
      this.winningType[1]++;
    } else if (
      outputsForWin[6] === outputsForWin[7] &&
      outputsForWin[7] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      this.winValue = 'row3';
      this.winningType[2]++;
    } else if (
      outputsForWin[0] === outputsForWin[3] &&
      outputsForWin[3] === outputsForWin[6] &&
      outputsForWin[6] != ''
    ) {
      this.winValue = 'col1';
      this.winningType[3]++;
    } else if (
      outputsForWin[1] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[7] &&
      outputsForWin[7] != ''
    ) {
      this.winningType[4]++;
      this.winValue = 'col2';
    } else if (
      outputsForWin[2] === outputsForWin[5] &&
      outputsForWin[5] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      this.winValue = 'col3';
      this.winningType[5]++;
    } else if (
      outputsForWin[0] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      this.winValue = 'dia1';
      this.winningType[6]++;
    } else if (
      outputsForWin[2] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[6] &&
      outputsForWin[6] != ''
    ) {
      this.winValue = 'dia2';
      this.winningType[7]++;
    }
    return this.winValue;
  }
  checkForPredictWin(outputsForWin: any[]) {
    let winValues = '';
    if (
      outputsForWin[0] === outputsForWin[1] &&
      outputsForWin[1] === outputsForWin[2] &&
      outputsForWin[2] != ''
    ) {
      winValues = 'row1';
    } else if (
      outputsForWin[3] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[5] &&
      outputsForWin[5] != ''
    ) {
      winValues = 'row2';
    } else if (
      outputsForWin[6] === outputsForWin[7] &&
      outputsForWin[7] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      winValues = 'row3';
    } else if (
      outputsForWin[0] === outputsForWin[3] &&
      outputsForWin[3] === outputsForWin[6] &&
      outputsForWin[6] != ''
    ) {
      winValues = 'col1';
    } else if (
      outputsForWin[1] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[7] &&
      outputsForWin[7] != ''
    ) {
      winValues = 'col2';
    } else if (
      outputsForWin[2] === outputsForWin[5] &&
      outputsForWin[5] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      winValues = 'col3';
    } else if (
      outputsForWin[0] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[8] &&
      outputsForWin[8] != ''
    ) {
      winValues = 'dia1';
    } else if (
      outputsForWin[2] === outputsForWin[4] &&
      outputsForWin[4] === outputsForWin[6] &&
      outputsForWin[6] != ''
    ) {
      winValues = 'dia2';
    }
    return winValues;
  }
  changeMode() {
    if (this.mode === 'Easy') {
      this.mode = 'Hard';
    } else if (this.mode === 'Hard') {
      this.mode = 'Impossible';
    } else {
      this.mode = 'Easy';
    }
    this.restartDelay(1000, '');
  }

  restartDelay(time: number, txt: string) {
    console.log(txt);
    setTimeout(() => {
      this.blockValue = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
      this.outputs = ['', '', '', '', '', '', '', '', ''];
      this.value = 'X';
      this.winningType = [0, 0, 0, 0, 0, 0, 0, 0];
      this.move = 0;
      this.turn = 0;
      this.winValue = '';
    }, time);
  }

  validateMove(id: number, block: any[]) {
    if (block[id] != -1) {
      return true;
    } else {
      return false;
    }
  }
  predictWinMove(matrix: any[], moveType: string) {
    let winPossibility = [
      [matrix[0], matrix[1], matrix[2]],
      [matrix[3], matrix[4], matrix[5]],
      [matrix[6], matrix[7], matrix[8]],
      [matrix[0], matrix[3], matrix[6]],
      [matrix[1], matrix[4], matrix[7]],
      [matrix[2], matrix[5], matrix[8]],
      [matrix[0], matrix[4], matrix[8]],
      [matrix[2], matrix[4], matrix[6]],
    ];
    const winIndex = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 3, 6, 1, 4, 7, 2, 5, 8, 0, 4, 8, 2, 4, 6,
    ];
    let possibleWins: any[] = [];
    for (let i = 0; i < winPossibility.length; i++) {
      const operatedMatrix = winPossibility[i];
      // console.log(operatedMatrix, i);

      let countMove = 0;
      let countEmpty = 0;
      for (let j = 0; j < operatedMatrix.length; j++) {
        const valAtPosition = operatedMatrix[j];
        // console.log(valAtPosition);

        if (valAtPosition == moveType) {
          countMove++;
        } else if (valAtPosition == '') {
          countEmpty++;
        }
      }
      // console.log(countMove, countEmpty);
      if (countMove == 2 && countEmpty == 1) {
        // console.log(`Index is : ${winIndex[operatedMatrix.indexOf('') + 3 * i]}`);
        possibleWins.push(winIndex[operatedMatrix.indexOf('') + 3 * i]);
      }
      // console.log(possibleWins);
    }
    return possibleWins.sort((n1, n2) => n1 - n2);
  }
}
