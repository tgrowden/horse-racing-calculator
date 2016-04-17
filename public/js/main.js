function Notify(msg, type) {
  $.notify({
    message: msg
  }, {
    type: type
  });
}
angular.module('myApp', [])
  .controller('addController', ['$scope', function($scope) {
    $scope.horses = [];
    $scope.betAmount = '';
    $scope.addHorse = function() {
      var horse = {
        name: $scope.name,
        odds: $scope.odds
      };
      if (typeof horse.name !== 'undefined' && typeof horse.odds !== 'undefined') {
        $scope.horses.push(horse);
      } else {
        Notify("Please add name and odds", "danger");
      }
      $scope.name = "";
      $scope.odds = "";
      document.getElementById("name").focus();
    };
    $scope.removeHorse = function(index) {
      $scope.horses.splice(index, 1);
    };
    $scope.calculateBets = function() {
      $('#calculate').tooltip('hide');
      if ($scope.horses.length > 1) {
        if (typeof $scope.betAmount != "undefined") {
          var split = new Split($scope.betAmount);
          angular.forEach($scope.horses, function(horse, key) {
            split.addItem(horse.name, horse.odds);
            console.log(horse.name, horse.odds);
          });
          var results = split.gamble();
          $scope.results = [];
          for (var i in results) {
            results[i].print();
            var horseResult = {
              id: results[i].id,
              odds: results[i].odds,
              bet: results[i].bet.toFixed(2),
              profit: results[i].profit.toFixed(2),
              result: results[i].result.toFixed(2),
              resultLessBet: results[i].resultLessBet.toFixed(2)
            };
            $scope.results.push(horseResult);
          }
          if (split.winning()) {
            Notify("Winning!", "success");
          } else {
            $scope.results = [];
            Notify("It doesn't look like you can win. Try removing some outliers...", "danger");
          }
        } else {
          Notify("Enter an Amount to Bet", "danger");
        }
      } else {
        Notify("You need to add more than one horse!", "danger");
      }
    };
    $scope.reset = function(betAmount) {
      if (betAmount) {
        $scope.betAmount = "";
      }
      $scope.horses = [];
      $scope.results = [];
      $scope.name = "";
      $scope.odds = "";
      $scope.raceName = "";
      $scope.raceNotes = "";
    };
    $scope.dummyData = function() {
      $scope.horses = [
        {
          name: "Honor Code",
          odds: 4.70
        },
        {
          name: "Keen Ice",
          odds: 9.70
        },
        {
          name: "Tonalist",
          odds: 6
        },
        {
          name: "Frosted",
          odds: 11.30
        },
        {
          name: "Gleneagles (IRE)",
          odds: 11.10
        },
        {
          name: "Effinex",
          odds: 33
        },
        {
          name: "Hard Aces",
          odds: 72.8
        }
      ];
      $scope.betAmount = 100;
      $scope.raceName = "Breeders' Cup - 2015";
      $scope.raceNotes = '\'American Pharaoh\' was excluded from the lineup because his odds were 0.7--an outlier such as this makes it impossible to calculate results.';
      $('#calculate').tooltip('show');
    };
    $scope.savePDF = function() {
      if (typeof $scope.raceName != "undefined") {
        if ($scope.horses.length > 1) {
          $scope.calculateBets();
          var columns = ["#", "Name", "Odds", "Bet", "Win", "Less Bet", "Profit"];
          var rows = [];
          var count = 1;
          for (var i in $scope.results) {
            console.log($scope.results[i]);
            var data = [];
            data.push(count, $scope.results[i].id, $scope.results[i].odds, $scope.results[i].bet, $scope.results[i].result, $scope.results[i].resultLessBet, $scope.results[i].profit);
            rows.push(data);
            count++;
          }
          var doc = new jsPDF('p', 'pt');
          doc.text(20, 20, $scope.raceName);
          doc.autoTable(columns, rows);
          doc.addPage();
          var notes = doc.splitTextToSize($scope.raceNotes, 550);
          doc.text(20, 20, notes);
          doc.save($scope.raceName + '.pdf');
        } else {
          Notify("You haven't added enough horses!", "danger");
        }
      } else {
        Notify("Please enter a Race Name", "danger");
      }
    };
  }
]);

$(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="tooltip"]').on('click', function() {
    $(this).tooltip('hide');
  });
  $('#helpIcon').on("click", function() {
    $('#helpModal').modal();
  });
});
