/*

CURL
//ya29.a0AXeO80TtbtJDnLGJYLqXuERMpoi9HHkMnBvdFQ2mYw7RhiZZcjwVGkjeER5dKqY55ef9edxyQlluvbwaT5Sqr7aOXrLlkpIcK_ULDUdLM5TYd76S64JmijRpPU0uZcA6bPWP5siexw2fm7LEXin9Ym-orxknM19ZKdK30W5HaCgYKAX0SARISFQHGX2MigOPoMDU2hIVjfDd19ShoRg0175

auth
curl -X POST http://localhost:3000/auth -d '{"authorization" : "ya29.a0AXeO80QWF5RpKT3YYtRt5rs6IoVviFFr0Ncd25Y1M78vzWzBbEFq9ceefKLGwlvDgV8YolQLBmHoAndNg3Xl6Pkb-h7SYcqn16NhPxLQp1tdj0yhUTgfzLAkPG_OCChnBeQ41_BVNZZnijBvrmt3jLvEsroKC2Tuzk5jqp3maCgYKAZUSARISFQHGX2Mij6UxoHOZRV_n28JSbee9Xg0175"}' -H 'Content-Type: application/json'

update user
curl -X PUT http://localhost:3000/users -d '{"avatar": "images/alexi.png", "name": "Alexi"}'  -H 'Content-Type: application/json'  -H 'authorization: ya29.a0AXeO80QWF5RpKT3YYtRt5rs6IoVviFFr0Ncd25Y1M78vzWzBbEFq9ceefKLGwlvDgV8YolQLBmHoAndNg3Xl6Pkb-h7SYcqn16NhPxLQp1tdj0yhUTgfzLAkPG_OCChnBeQ41_BVNZZnijBvrmt3jLvEsroKC2Tuzk5jqp3maCgYKAZUSARISFQHGX2Mij6UxoHOZRV_n28JSbee9Xg0175'  

update location
curl -X POST http://localhost:3000/locations  -d '{"latitude": "-51.508347", "longitude": "0.0764236"}' -H 'Content-Type: application/json'  -H 'authorization: ya29.a0AXeO80QWF5RpKT3YYtRt5rs6IoVviFFr0Ncd25Y1M78vzWzBbEFq9ceefKLGwlvDgV8YolQLBmHoAndNg3Xl6Pkb-h7SYcqn16NhPxLQp1tdj0yhUTgfzLAkPG_OCChnBeQ41_BVNZZnijBvrmt3jLvEsroKC2Tuzk5jqp3maCgYKAZUSARISFQHGX2Mij6UxoHOZRV_n28JSbee9Xg0175'   

//send invite
curl -X POST http://localhost:3000/invites/2  -H 'Content-Type: application/json'  -H 'authorization: ya29.a0AXeO80QWF5RpKT3YYtRt5rs6IoVviFFr0Ncd25Y1M78vzWzBbEFq9ceefKLGwlvDgV8YolQLBmHoAndNg3Xl6Pkb-h7SYcqn16NhPxLQp1tdj0yhUTgfzLAkPG_OCChnBeQ41_BVNZZnijBvrmt3jLvEsroKC2Tuzk5jqp3maCgYKAZUSARISFQHGX2Mij6UxoHOZRV_n28JSbee9Xg0175'   

//get invites ???
curl http://localhost:3000/invites/2 -H 'Content-Type: application/json'  -H 'authorization: ya29.a0AXeO80TtbtJDnLGJYLqXuERMpoi9HHkMnBvdFQ2mYw7RhiZZcjwVGkjeER5dKqY55ef9edxyQlluvbwaT5Sqr7aOXrLlkpIcK_ULDUdLM5TYd76S64JmijRpPU0uZcA6bPWP5siexw2fm7LEXin9Ym-orxknM19ZKdK30W5HaCgYKAX0SARISFQHGX2MigOPoMDU2hIVjfDd19ShoRg0175'   

decline invite
curl -X POST http://localhost:3000/invites/3/decline -H 'Content-Type: application/json' -H 'authorization: ya29.a0AXeO80QWF5RpKT3YYtRt5rs6IoVviFFr0Ncd25Y1M78vzWzBbEFq9ceefKLGwlvDgV8YolQLBmHoAndNg3Xl6Pkb-h7SYcqn16NhPxLQp1tdj0yhUTgfzLAkPG_OCChnBeQ41_BVNZZnijBvrmt3jLvEsroKC2Tuzk5jqp3maCgYKAZUSARISFQHGX2Mij6UxoHOZRV_n28JSbee9Xg0175'

accept invite
curl -X POST http://localhost:3000/invites/1/accept -H 'Content-Type: application/json' -H 'authorization: ya29.a0AXeO80T049gKaDPtNRs_NfWx9e_s36zqXleSvDltf9usZWE0XQ0ZFT6R85fo14vz1fA7ibUFHkTNvd_1RGbTDJYTSB7L8JA2z3r6fTNJmtwIq7MzYD7PD22FJ3oZqHES6Gen6iAqnS8RlDTuxBUI62dqnnJn7CX2qGBY72DnaCgYKAfQSARISFQHGX2Mi0CTjD2JyQsgnX3bJe28j_g0175'

delete friend
curl -X DELETE http://localhost:3000/friends/1 -H 'Content-Type: application/json' -H 'authorization: ya29.a0AXeO80T049gKaDPtNRs_NfWx9e_s36zqXleSvDltf9usZWE0XQ0ZFT6R85fo14vz1fA7ibUFHkTNvd_1RGbTDJYTSB7L8JA2z3r6fTNJmtwIq7MzYD7PD22FJ3oZqHES6Gen6iAqnS8RlDTuxBUI62dqnnJn7CX2qGBY72DnaCgYKAfQSARISFQHGX2Mi0CTjD2JyQsgnX3bJe28j_g0175'

get friends
curl http://localhost:3000/friends -H 'Content-Type: application/json' -H "authorization:  ya29.a0AXeO80QgbKylvJpwGvlnKqsHa4_2EXNudMUHV-aVnMtLsaFnDAOXD2XG7snCD_UIhUlSrswiH2NMgQc0dFIalnDctZNxDJuu8lB31P06tFt41ITkGcyoxL51POfe6HJxDFYEeyWRailzBJTwaGf9Q0laq2laALPWx2iyFPzHYwaCgYKARISARISFQHGX2MiGz-PGV0oiE02Ukhf2YB4Tw0177"

find users

curl 'http://localhost:3000/users?search=bob@' -H "Content-Type: application/json" -H "authorization: ya29.a0AXeO80QKMBa_9UNTn8OrBrBqazKlHf4ikR_OMYs-N1CZcgImiapgHuxTqhtVg6DkZlSdXqRZVjnyb-S6iJZNr7VKJtqSGjsMS9whNhBLEFVr469bNiQ920lzIMcoMUWN8xUMMOqlS5YzUEXUjBhAXkc_wNSCkyVIHDEV53RHaCgYKAdESARISFQHGX2MiWQdEkKb80_YQ0mvZZvom9A0175"


*/