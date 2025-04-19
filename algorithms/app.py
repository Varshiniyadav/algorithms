from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mergesort')
def mergesort():
    return render_template('mergesort.html')

@app.route('/dijkstra')
def dijkstra():
    return render_template('dijkstra.html')

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')