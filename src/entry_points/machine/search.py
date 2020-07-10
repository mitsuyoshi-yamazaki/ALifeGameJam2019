header = 4
DEBUG = True

def log(s):
  if DEBUG == True:
    print(s)

def create(l):
  return [format(i, '0%sb' % l) for i in xrange(pow(2, l))]

def check_header(b, i):
  l = len(b)
  for j in xrange(header):
    if int(b[j]) ^ int(b[(i - 4 + j) % l]) != 1:
      return False
  return True

def check_header_with(h, other, i):
  l = len(other)
  for j in xrange(header):
    if int(h[j]) ^ int(other[(i - 4 + j) % l]) != 1:
      return False
  return True

def check_replication(b, i):
  l = len(b)
  transaction = l - header
  transaction_table = b[header:]
  log('l: {}, h: {}, t: {}'.format(l, header, transaction))
  for j in xrange(l):
    t = transaction_table[j % transaction]
    c = b[(i + j) % l]
    e = b[j]
    log('{}: {}({}) ^ {}({}) ? {}({})'.format(j, t, header + (j % transaction), c, (i + j) % l, e, j))
    if int(t) ^ int(c) != int(e):
      return False
  return True

def check(b, i):
  if check_header(b, i) == False:
    return False
  return check_replication(b, i)

def child(t, other, i):
  l = len(other)
  m = pow(2, l) - 1
  n = int(other, 2)
  shifted = (((n << l) + n) >> (l - i)) & m
  binary = int(t, 2) ^ shifted
  return  format(binary, '0%sb' % l)


# -------- Search Self-Reproducible Genes -------- #

def search_self_reproducible(l):
  result = []
  a = create(l)
  for b in a:
    for i in xrange(l):
      if check(b, i) == True:
        result.append((b, i))
  return result

search_self_reproducible(10)


# -------- Search Genes that can match itself -------- #

def check_self_matchable(l):
  result = {}
  a = create(l)
  for b in a:
    r = []
    for i in xrange(l):
      if check_header(b, i) == True:
        r.append(i)
    if len(r) > 0:
      result[b] = r
  return result

check_self_matchable(10)


# -------- Search All Combinations and Offsprings -------- #

def search_all_combinations(l):
  transition = l - header
  result = {}
  a = create(l)
  ii = 0
  for b in a:
    if (ii % 10000) == 0:
      log("{} genes".format(ii))
    ii += 1
    r = {}
    t = b[header:l] + b[header:(header * 2)]
    for other in a:
      rr = []
      for i in xrange(l):
        if check_header_with(b, other, i) == True:
          rr.append(child(t, other, i))
      if len(rr) > 0:
        r[other] = rr
    if len(r) > 0:
      result[b] = r
  return result

search_all_combinations(10)