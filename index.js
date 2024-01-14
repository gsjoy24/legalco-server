const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`server is running on ${port} for Legalco`);
});

app.get('/', (req, res) => {
	res.send(`server is running for Legalco`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.bivrpo6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		client.connect();

		// * collections
		const appointmentCollection = client.db('Legalco').collection('appointments');
		const adminCollection = client.db('Legalco').collection('admins');
		const blogCollection = client.db('Legalco').collection('blogs');
		const lawyerCollection = client.db('Legalco').collection('lawyer');
		const serviceCollection = client.db('Legalco').collection('services');
		const reviewCollection = client.db('Legalco').collection('reviews');
		const lawyerAppointmentsCollection = client.db('Legalco').collection('lawyerappointments');

		// add appointments
		app.post('/appointments', async (req, res) => {
			const newAppointment = req.body;
			const result = await appointmentCollection.insertOne(newAppointment);
			res.send(result);
		});

		// get all appointments
		app.get('/appointments', async (req, res) => {
			const result = await appointmentCollection.find().toArray();
			res.send(result);
		});

		// delete an appointment
		app.delete('/appointments/:id', async (req, res) => {
			const query = { _id: new ObjectId(req.params.id) };
			const result = await appointmentCollection.deleteOne(query);
			res.send(result);
		});

		// // sorting method
		// app.get('/toys/:user/sort', async (req, res) => {
		// 	const type = req.query.type === 'ascending';
		// 	const user = req.params.user;
		// 	const query = { seller_email: user };

		// 	let sortObj = { price: 1 };
		// 	if (type) {
		// 		sortObj = { price: 1 };
		// 	} else {
		// 		sortObj = { price: -1 };
		// 	}
		// 	const result = await toyCollection.find(query).sort(sortObj).toArray();
		// 	res.send(result);
		// });

		// to get single toy
		// app.get('/toys/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: new ObjectId(id) };
		// 	const result = await toyCollection.findOne(query);
		// 	res.send(result);
		// });

		// update toys information
		// app.patch('/toys/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const toy = req.body;
		// 	const query = { _id: new ObjectId(id) };
		// 	const updatedDoc = {
		// 		$set: toy
		// 	};
		// 	const result = await toyCollection.updateOne(query, updatedDoc);
		// 	res.send(result);
		// });

		// delete from database
		// app.delete('/toys/:id', async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: new ObjectId(id) };
		// 	const result = await toyCollection.deleteOne(query);
		// 	res.send(result);
		// });

		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log('Pinged your deployment. You successfully connected to MongoDB!');
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);
