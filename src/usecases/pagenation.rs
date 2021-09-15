use super::{repo_err, Result};
use crate::repository;

pub fn pagenation<T>(
    get_items_gt_id: &mut impl Fn(i32, i64) -> repository::Result<Vec<T>>,
    get_items_lt_id: &mut impl Fn(i32, i64) -> repository::Result<Vec<T>>,
    after: Option<String>,
    before: Option<String>,
    first: Option<usize>,
    last: Option<usize>,
) -> Result<(Vec<T>, bool, bool)> {
    let (asc, limit, id) = match (first, last) {
        (None, None) => {
            return Err(format!("'first' or 'last' required in PagingInput").into());
        }
        (Some(_), Some(_)) => {
            return Err(format!("cannot specify 'first' and 'last' same time").into());
        }
        (Some(limit), None) => (true, limit, after),
        (None, Some(limit)) => (false, limit, before),
    };

    if limit < 1 {
        return Err("invalid limit".into());
    }
    let limit = limit.min(20) as i64;

    let id = id
        .map(|x| x.parse().unwrap())
        .unwrap_or(if asc { 0 } else { i32::MAX });

    let (items, has_prev, has_next): (Vec<_>, _, _) = if asc {
        let mut items = get_items_gt_id(id, limit + 1).map_err(repo_err)?;
        let has_next = items.len() > limit as usize;
        let has_prev = get_items_lt_id(id, 2).map_err(repo_err)?.len() == 2;
        if has_next {
            items.pop();
        }
        (items, has_prev, has_next)
    } else {
        let mut items = get_items_lt_id(id, limit + 1).map_err(repo_err)?;
        let has_prev = items.len() > limit as usize;
        let has_next = get_items_gt_id(id, 2).map_err(repo_err)?.len() == 2;
        if has_prev {
            items.remove(0);
        }
        (items, has_prev, has_next)
    };
    Ok((items, has_prev, has_next))
}
