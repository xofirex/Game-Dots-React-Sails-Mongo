import React from 'react';
import './Leaderboard.css';

class Leaderboard extends React.Component {
render() {
    return (
        <table className="table table-striped table-dark">
  <thead>
    <tr>
      <th scope="col">Номер в рейтинге</th>
      <th scope="col">Имя игрока</th>
      <th scope="col">Количество побед</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Dotsplayer</td>
      <td>11</td>
    </tr>
 
  </tbody>
</table>
    )

  }
}
  export default Leaderboard;