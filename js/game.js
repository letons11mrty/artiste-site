document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("puzzle-container");
  const hintImage = document.getElementById("hint-image");
  const resetButton = document.getElementById("reset-button");
  const hintButton = document.getElementById("hint-button");
  const rankingListEasy = document.getElementById("ranking-list-easy");
  const rankingListMedium = document.getElementById("ranking-list-medium");
  const rankingListHard = document.getElementById("ranking-list-hard");
  const usernameInput = document.getElementById("username");
  const imageSelector = document.getElementById("image-selector");
  const difficultySelector = document.getElementById("difficulty-selector");
  let totalPieces = 9; // ピースの総数
  const imageUrls = [
    "img/img_tohiko.jpg",
    "img/img_pray.jpg",
    "img/img_fightsong.jpg",
    /* 好きなものを入れてください */
  ];  /* 使用する画像のリスト */
  let imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]; // ランダムに画像を選択
  let startTime; // タイマーの開始時間
  let timerInterval; // タイマーのInterval ID
  let hintTimeout; // ヒント表示のTimeout ID
  let selectedPiece = null;
  let isCompleted = false; // 完成状態のフラグ
  let isTimerStarted = false; // タイマー開始フラグ
  let currentDifficulty = "easy"; // 現在の難易度

  let rankings = {
    easy: JSON.parse(localStorage.getItem("rankings_easy")) || [],
    medium: JSON.parse(localStorage.getItem("rankings_medium")) || [],
    hard: JSON.parse(localStorage.getItem("rankings_hard")) || []
  };

  // ランキング詳細
  function updateRanking(elapsedTime) {
    const username = usernameInput.value || "匿名";
    rankings[currentDifficulty].push({ username, time: elapsedTime });
    rankings[currentDifficulty].sort((a, b) => a.time - b.time);
    rankings[currentDifficulty] = rankings[currentDifficulty].slice(0, 10); // 上位10件のみ保存
    localStorage.setItem(`rankings_${currentDifficulty}`, JSON.stringify(rankings[currentDifficulty]));
    displayRanking();
  }

  function displayRanking() {
    rankingListEasy.innerHTML = "";
    rankingListMedium.innerHTML = "";
    rankingListHard.innerHTML = "";

    /* 下級ランキング */
    rankings.easy.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.username}: ${entry.time}秒`;
      rankingListEasy.appendChild(listItem);
    });

    /* 中級ランキング */
    rankings.medium.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.username}: ${entry.time}秒`;
      rankingListMedium.appendChild(listItem);
    });

    /* 上級ランキング */
    rankings.hard.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.username}: ${entry.time}秒`;
      rankingListHard.appendChild(listItem);
    });
  }

  function completeGame() {
    updateRanking(Math.floor((Date.now() - startTime) / 1000));
  }

  displayRanking();

  // タイマーを表示する要素を作成
  const timerDisplay = document.createElement("div");
  timerDisplay.id = "timer";
  timerDisplay.textContent = "タイム: 0秒";
  document.body.insertBefore(timerDisplay, container);

  // 「完成！」メッセージ用の要素
  const completionMessage = document.createElement("div");
  completionMessage.id = "completion-message";
  completionMessage.style.display = "none";
  completionMessage.textContent = "おめでとうございます！パズル完成！";
  document.body.appendChild(completionMessage);

  // ピースを生成
  let pieces = [];
  function createPieces() {
    pieces = [];
    const gridSize = Math.sqrt(totalPieces);
    container.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `${-(i % gridSize) * 100}px ${-Math.floor(i / gridSize) * 100}px`;
        piece.style.backgroundSize = `${100 * gridSize}px ${100 * gridSize}px`;
        piece.dataset.index = i;
        pieces.push(piece);
    }

    // ピースをランダムに配置（Fisher-Yates シャッフル）
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    pieces.forEach(piece => container.appendChild(piece));
  }

  createPieces();

  // タイマーを開始
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `タイム: ${elapsedTime}秒`;
        hintTimeout = setTimeout(() => {
          hintButton.style.display = "block";
      }, 10000);
    }, 1000);
  }

  // クリックで位置を交換する機能
  container.addEventListener("click", (e) => {
      if (isCompleted) return; // 完成後はクリック無効化

      const target = e.target;
      if (!target.classList.contains("puzzle-piece")) return;

      if (!isTimerStarted) {
          startTimer();
          isTimerStarted = true;
      }

      if (!selectedPiece) {
          selectedPiece = target;
          target.style.border = "2px solid red";
      } else {
          const tempIndex = selectedPiece.dataset.index;
          selectedPiece.dataset.index = target.dataset.index;
          target.dataset.index = tempIndex;

          [selectedPiece.style.backgroundPosition, target.style.backgroundPosition] =
              [target.style.backgroundPosition, selectedPiece.style.backgroundPosition];

          selectedPiece.style.border = "1px solid #ccc";
          selectedPiece = null;

          // 正解のチェック
          if (checkCompletion(pieces)) {
              completeGame(); // ゲームを終了
          }
      }
  });

  // 正解判定関数
  function checkCompletion(pieces) {
      return pieces.every(piece => piece.dataset.index == Array.from(container.children).indexOf(piece));
  }

  // ゲーム終了処理
  function completeGame() {
      isCompleted = true; // 完成フラグを設定
      clearInterval(timerInterval); // タイマーを停止
      clearTimeout(hintTimeout); // ヒント表示のタイマーをクリア
      completionMessage.style.display = "block"; // 完成メッセージを表示
      hintImage.style.display = "none"; // ヒントを非表示
      resetButton.style.display = "block"; // 「もう一度」ボタンを表示
      hintButton.style.display = "none"; // ヒントボタンを非表示
      updateRanking(Math.floor((Date.now() - startTime) / 1000)); // ランキングを更新
  }

  // 「もう一度」ボタンのクリックイベント
  resetButton.addEventListener("click", () => {
      // 初期化
      container.innerHTML = "";
      completionMessage.style.display = "none";
      hintImage.style.display = "none";
      hintImage.classList.remove("fade-in");
      resetButton.style.display = "none";
      hintButton.style.display = "none";
      isCompleted = false;
      isTimerStarted = false;

      // 新しい画像を選択
      imageUrl = imageSelector.value;

      // ピースを再生成
      createPieces();

      // タイマーを再開始
      clearInterval(timerInterval);
      clearTimeout(hintTimeout);
  });

  // ヒント表示ボタンのクリックイベント
  hintButton.addEventListener("click", () => {
      hintImage.src = imageUrl;
      hintImage.style.display = "block";
  });

  // 画像選択ボタンのイベントリスナーを追加
  imageSelector.addEventListener("change", (e) => {
      imageUrl = e.target.value;
      container.innerHTML = "";
      createPieces();
  });

  // 難易度選択ボタンのイベントリスナーを追加
  difficultySelector.addEventListener("change", (e) => {
      const gridSize = parseInt(e.target.value);
      totalPieces = gridSize * gridSize;
      container.innerHTML = "";
      createPieces();

      // ページの拡大度を変更
      if (gridSize === 10) {
          document.body.style.zoom = "0.64"; // 64%に縮小
          currentDifficulty = "hard";
      } else if (gridSize === 5) {
          document.body.style.zoom = "1"; // 元のサイズに戻す
          currentDifficulty = "medium";
      } else {
          document.body.style.zoom = "1"; // 元のサイズに戻す
          currentDifficulty = "easy";
      }
  });
});