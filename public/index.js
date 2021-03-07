function getLirik() {
    let title = document.getElementById('title').innerText
    let cariManual = `Jika lirik tidak cocok<br>Masukkan judul secara manual<br><br><form><label for="manual" class="d-block text-center">Judul :</label><input class="d-block mx-auto text-start" type="text" id="manual" name="manual"><button id="cariManual" type="button" class="btn btn-primary border-0 d-block mx-auto mt-2"><b>Search</b></button></form>`
    function searchLirik() {
        document.getElementById("cariManual").onclick = function () {
            let judulManual = document.getElementById("manual").value
            fetch(`https://rasyidrafi.glitch.me/api/lirik?q=${judulManual}`)
                .then(response => response.json())
                .then(hasil => {
                    let awal = hasil.lyrics
                    let lirik = awal.replace(/\n/g, "<br>")
                    document.getElementById("isiLirik").innerHTML = lirik
                })
            document.getElementById("cariGan").innerHTML = cariManual
        }
    }

    fetch(`https://rasyidrafi.glitch.me/api/lirik?q=${title}`)
        .then(response => response.json())
        .then(data => {
            let awal = data.lyrics
            let lirik = awal.replace(/\n/g, "<br>")
            document.getElementById("isiLirik").innerHTML = lirik
            document.getElementById("cariGan").innerHTML = cariManual

            document.getElementById("cariManual").onclick = function () {
                searchLirik();
            }
        })
        .catch(() => {
            document.getElementById("isiLirik").innerHTML = `Lirik tidak ditemukan<br>Masukkan judul secara manual<br><br><form><label for="manual" class="d-block text-center">Judul :</label><input class="d-block mx-auto text-start" style="font-size: 18px;" type="text" id="manual" name="manual"><button id="cariManual" type="button" class="btn btn-primary border-0 d-block mx-auto mt-2"><b>Search</b></button></form>`

            document.getElementById("cariManual").onclick = function () {
                let judulManual = document.getElementById("manual").value
                searchLirik();
            }
        });
}