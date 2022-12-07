function searchLirik() {
    let cariManual = `Jika lirik tidak cocok<br>Masukkan judul secara manual<br><br><form><label for="manual" class="d-block text-center">Judul :</label><input class="d-block mx-auto text-start" type="text" id="manual" name="manual"><button id="cariManual" type="button" onclick="searchLirik()" class="btn btn-primary border-0 d-block mx-auto mt-2"><b>Search</b></button></form>`
    let notFound = `Lirik tidak ditemukan<br>Masukkan judul secara manual<br><br><form><label for="manual" class="d-block text-center">Judul :</label><input class="d-block mx-auto text-start" style="font-size: 18px;" type="text" id="manual" name="manual"><button id="cariManual" type="button"  class="btn btn-primary border-0 d-block mx-auto mt-2"><b>Search</b></button></form>`
    document.getElementById("cariManual").onclick = function () {
        let judulManual = document.getElementById("manual").value
        fetch(`/api/lirik?q=${judulManual}`)
            .then(response => response.json())
            .then(res => {
                document.getElementById("isiLirik").innerHTML = res.data
                document.getElementById("cariGan").innerHTML = cariManual
            })
            .catch(() => {
                document.getElementById("isiLirik").innerHTML = notFound
            })
    }
}