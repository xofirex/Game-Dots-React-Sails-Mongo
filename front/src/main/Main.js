import React from 'react';
import './Main.css';

class Main extends React.Component {
    state = {
        boardSize: 9,
        pointtowin: 3,
        dotsColor: {},
        count: 0,
        turnname: "Первым ходит игрок номер 1, цвет красный",
        usedots: [],
        countred: 0,
        countblue: 0,
        isWinner: "",
        
    }

    changeBoardSize = (event) => {
        if (window.confirm('Это действие удалит все результаты текущей игры и начнет новую, вы уверены?')) {
            let newBoardSize
            let newpointtowin
            if (event.target.id === "small") {
                newBoardSize = 9
                newpointtowin = 5
            } else if (event.target.id === "medium") {
                newBoardSize = 14
                newpointtowin = 7
            } else if (event.target.id === "large") {
                newBoardSize = 19
                newpointtowin = 10
            }else if (event.target.id === "newgame"){
                newBoardSize = this.state.boardSize
                newpointtowin = this.state.pointtowin
            }
            this.setState({
                boardSize: newBoardSize, dotsColor: {}, count: 0, turnname: "Первым ходит игрок номер 1, цвет красный",
                pointtowin: newpointtowin, countblue: 0, countred: 0, isWinner: "",
            })
        }
    }

    onClick = (dataCoord, dataCoorddot) => {      
        if(this.state.dotsColor[dataCoorddot] === "dot-red" || this.state.dotsColor[dataCoorddot] === "dot-blue"  ){
            alert("эта точка занята")
        }
        else{const colordot = (this.state.count % 2 === 0 ) ? "dot-red": "dot-blue";
        const turnname = (colordot === "dot-red") ? "ход игрока номер 2, цвет синий": "ход игрока номер 1, цвет красный";

        this.setState(prevState => ({
            dotsColor: {
                ...prevState.dotsColor,
                [dataCoorddot]: colordot
            }
    
        }
        )
        
        );
  
        this.setState({count: this.state.count+1 , turnname: turnname, } )
        this.check(dataCoord, colordot)
        
        }
        
        
        
    };
    
    check = (dataCoord, colordot) =>{
      let horizontalCoord = dataCoord.X;
      let verticalCoord = dataCoord.Y;
      let Coord1 = [horizontalCoord-1, verticalCoord];
      let Coord2 = [horizontalCoord, verticalCoord+1];
      let Coord3 = [horizontalCoord+1, verticalCoord];
      let Coord4 = [horizontalCoord, verticalCoord-1];
      let coordlist = [Coord1, Coord2, Coord3, Coord4];
      let rowcolor = [horizontalCoord, verticalCoord];
      for (let coord = 0; coord < coordlist.length; coord++){
          let curentdot = coordlist[coord];
          let checkcolor = curentdot[0] + "," + curentdot[1];
          if (this.state.dotsColor[checkcolor] !== colordot )  
           {   
               this.filldots(curentdot, colordot, rowcolor)}             
      }
    }

    filldots = (curentdot, colordot, rowcolor, row=null) => {
        let maxsize = this.state.boardSize;
        let horizontalCoord = curentdot[0];
        let verticalCoord = curentdot[1];
        let Coord1 = [horizontalCoord-1, verticalCoord];
        let Coord2 = [horizontalCoord, verticalCoord+1];
        let Coord3 = [horizontalCoord+1, verticalCoord];
        let Coord4 = [horizontalCoord, verticalCoord-1];
        let coordlist = [Coord1, Coord2, Coord3, Coord4];
        let checktrue = 0; 
        row =row ? row: [];        
        for (let coord = 0; coord < coordlist.length; coord++){
            let checkdot = coordlist[coord];
            let checkcolor = checkdot[0] + "," + checkdot[1];
            if(checkdot[0] > -2 && checkdot[1] > -2 && checkdot[0] <= maxsize && checkdot[1] <= maxsize){
                // eslint-disable-next-line
                row.forEach(oneelement => {                  
                    if(checkdot[0]===oneelement[0] && checkdot[1] === oneelement[1]){
                        checktrue++;
                    }  
                }
                );
                if (this.state.dotsColor[checkcolor] === colordot  ||
                (checkdot[0]===rowcolor[0] && checkdot[1] === rowcolor[1])){
                    checktrue += 1;
                    if(checktrue===4){
                        row.push(curentdot)
                        this.closedloop(row, colordot)
                    }
                   
                }
                else{
                    row.push(curentdot)
                    let x = 0;
                    row.forEach(oneelement => {
                        if(checkdot[0]===oneelement[0] && checkdot[1] === oneelement[1]){
                            x++;
                        }  
                    }
                    );
                    if(x===0){                        
                        this.filldots(checkdot, colordot, rowcolor, row);        
                    }                                                                                     
                }            
           
            }
          
        }  
    }

    closedloop = (row, colordot) => {
      
        let maxsize = this.state.boardSize;   
        let is_end = true;
        for (let checkdot in row){
            if(row[checkdot][0] < 1 || row[checkdot][1] < 1 || row[checkdot][0] >= maxsize || row[checkdot][1] >= maxsize){
                is_end = false;
                break;
            }
        }
        if (is_end){
            this.result(row, colordot)
        }
        
    }

    handleSubmitWinner = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        fetch('http://localhost:1337/score', {
            method: 'POST',
            body: data,
            mode: 'no-cors',
        }).then(() => {
            this.setState({ isWinner: null });
        });
    }

    result = (row, colordot) => {
        let pointtowin = this.state.pointtowin;     
        let poinset = new Set();
        row.forEach(element => {
            poinset.add(`${element[0]},${element[1]}`)
        });      
        for (let item of poinset){          
            if(this.state.dotsColor[item] === "dot-red"){
                // eslint-disable-next-line
                this.state.countblue++;
                if(this.state.countblue >= pointtowin){
                    alert("победил синий игрок")
                    this.setState({
                    isWinner: <div className="winnerform" >
                        <h5 className="text-primary">Победил красный игрок, введи свой ник:</h5>
                       <form onSubmit={this.handleSubmitWinner}>
                       <input name="username" type="text" required className="nickname"/>
                       <button type="submit" class="btn btn-primary">Submit</button>
                       </form>  
                   </div>
                       
                      })
                      break;
                                      
                }                                
            }
            else if(this.state.dotsColor[item] === "dot-blue"){
                // eslint-disable-next-line
                this.state.countred++;
                if(this.state.countred >= pointtowin){
                    alert("победил красный игрок") 
                    this.setState({isWinner: <div className="winnerform" >
                        <h5 className="text-danger">Победил синий игрок, введи свой ник:</h5>                        
                        <form onSubmit={this.handleSubmitWinner}>
                            <input name="username" type="text" required className="nickname"/>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>  
                    </div>
                        
                       })
                       break;
                                      
                }               
            }
            else{
                this.setState(prevState => ({
                    dotsColor: {
                        ...prevState.dotsColor,
                        [item]: colordot
                    }            
                }) );                                
            }
        }
    }

    renderRow = (currentIndex) => {
        const { boardSize } = this.state;
        var row = [];
        for (let j = 0; j <= 2 * boardSize; j++) {
            if (currentIndex % 2 === 0) {
                if (j % 2 === 0) {
                    const dataCoorddot = Math.floor(currentIndex / 2) + "," + Math.floor(j / 2);
                    const dataCoord = {X: Math.floor(currentIndex / 2), Y: Math.floor(j / 2)};
                    const isColor = this.state.dotsColor[dataCoorddot];  
                    row.push(
                        
                        <div     
                        onClick={() => this.onClick(dataCoord, dataCoorddot)}
                        // eslint-disable-next-line
                        className={"dot" + " " + (isColor ? isColor: "dot-black")}                       
                         />      
                    )
                    
                } else {
                    row.push(<div className="horizContainer" />)
                }
            } else {
                if (j % 2 === 0) {
                    row.push(<div className="vertContainer" />)
                } else {
                    row.push(<div className="box" />)
                }
            }
        }
        return row;
    }

    renderCols = () => {
        const { boardSize } = this.state;
        var cols = [];

        for (let i = 0; i <= 2 * boardSize; i++) {
            const row = this.renderRow(i);
            cols.push(<div className="row">{row}</div>)
        }

        return cols;
    }
    makeBoard = () => <div id="game-board">{this.renderCols()}</div>

    render() {
        return (
            <div id="game">
                <div id="header">
                    <h1 id="welcome">Точки </h1>              
                    <h3>Размеры поля : </h3>
                    <button id="small" class="btn btn-dark" onClick={this.changeBoardSize}> 10x10 </button>
                    <button id="medium" class="btn btn-dark" onClick={this.changeBoardSize}> 15x15 </button>
                    <button id="large" class="btn btn-dark" onClick={this.changeBoardSize}> 20х20 </button>
                    <h5 className="text-dark" id="winner"> Игра идет до:{this.state.pointtowin} очков </h5>
                    <h4 className="text-dark"> Количество очков: </h4>
                    <p id="score"> Игрок 1(Red):{this.state.countred}  Игрок 2(Blue):{this.state.countblue} </p>
                    <h5 className="text-dark" id="turnname"> {this.state.turnname} </h5>
                </div>
                <div id="board">
                    {this.makeBoard()}
                    <div className="form-win">
                            {this.state.isWinner}
                    </div>
                    <button id="newgame" class="btn btn-dark new-game" onClick={this.changeBoardSize}> Начать новую игру </button>
                </div>
            </div>
        );
    }
}


export default Main;
