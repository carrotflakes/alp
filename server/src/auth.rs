use std::collections::HashMap;

use jsonwebtoken::errors::ErrorKind;
use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

pub struct UID(pub String);
pub struct Authorize(HashMap<String, JWK>);

impl Authorize {
    pub async fn new() -> Self {
        // https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com から公開鍵を取得し、JWT ライブラリを使用して署名を確認します。該当エンドポイントからのレスポンスの Cache-Control ヘッダーに含まれる max-age の値を使用して、公開鍵を更新する時期を判別します。
        let jwks = get_firebase_jwks().await.unwrap();
        Authorize(jwks)
    }

    pub fn varify(&self, token: &str) -> Result<Option<UID>, String> {
        let mut validation = Validation::new(Algorithm::RS256);
        validation.set_audience(&["alp-chat-b4bce"]);

        let kid = match decode_header(token) {
            Ok(Header { kid: Some(kid), .. }) => kid,
            Ok(_) => return Err(format!("token not containd kid")),
            Err(err) => return Err(format!("decode header failed: {}", err)),
        };

        let jwk = if let Some(x) = self.0.get(&kid) {
            x
        } else {
            return Err(format!("invalid kid"));
        };

        let key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e).unwrap();

        let token_data = match decode::<Claims>(&token, &key, &validation) {
            Ok(c) => c,
            Err(err) => match *err.kind() {
                ErrorKind::InvalidToken => return Err(format!("Token is invalid")),
                ErrorKind::InvalidIssuer => return Err(format!("Issuer is invalid")),
                _ => return Err(format!("Some other errors: {}", err)),
            },
        };

        Ok(token_data.claims.sub.map(UID))
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    pub aud: String,
    pub iat: u64,
    pub exp: u64,
    pub iss: String,
    pub sub: Option<String>,
}

#[derive(Debug, Deserialize, Eq, PartialEq)]
pub struct JWK {
    pub e: String,
    pub alg: String,
    pub kty: String,
    pub kid: String,
    pub n: String,
}

pub async fn get_firebase_jwks() -> Result<HashMap<String, JWK>, awc::error::SendRequestError> {
    #[derive(Debug, Deserialize)]
    struct KeysResponse {
        keys: Vec<JWK>,
    }

    let url =
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

    let mut response = awc::Client::default()
        .get(url)
        .insert_header(("User-Agent", "Actix-web"))
        .send()
        .await?;
    let k: KeysResponse = response.json().await.unwrap();

    let mut key_map = HashMap::new();
    for key in k.keys {
        key_map.insert(key.kid.clone(), key);
    }
    Ok(key_map)
}
